package ctu.student.regreen.service.implement;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import ctu.student.regreen.dto.request.OrderRequest;
import ctu.student.regreen.dto.response.OrderResponse;
import ctu.student.regreen.enums.OrderStatusName;
import ctu.student.regreen.enums.PaymentStatusName;
import ctu.student.regreen.mapper.OrderMapper;
import ctu.student.regreen.model.Cart;
import ctu.student.regreen.model.CartItem;
import ctu.student.regreen.model.CartItemId;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.Invoice;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.model.OrderItem;
import ctu.student.regreen.model.OrderStatus;
import ctu.student.regreen.model.PaymentMethod;
import ctu.student.regreen.model.PaymentStatus;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.model.Voucher;
import ctu.student.regreen.repository.CartItemRepository;
import ctu.student.regreen.repository.CartRepository;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.InvoiceRepository;
import ctu.student.regreen.repository.OrderRepository;
import ctu.student.regreen.repository.OrderStatusRepository;
import ctu.student.regreen.repository.PaymentMethodRepository;
import ctu.student.regreen.repository.PaymentStatusRepository;
import ctu.student.regreen.repository.ProductRepository;
import ctu.student.regreen.repository.VoucherRepository;
import ctu.student.regreen.service.interfaces.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

        private final OrderRepository orderRepository;
        private final CustomerRepository customerRepository;
        private final ProductRepository productRepository;
        private final CartRepository cartRepository;
        private final CartItemRepository cartItemRepository;

        private final PaymentMethodRepository paymentMethodRepository;
        private final VoucherRepository voucherRepository;
        private final OrderStatusRepository orderStatusRepository;
        private final PaymentStatusRepository paymentStatusRepository;

        private final InvoiceRepository invoiceRepository;

        private final OrderMapper orderMapper;

        private Customer getCurrentCustomer() {
                String username = SecurityContextHolder.getContext().getAuthentication().getName();

                return customerRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("Customer not found"));
        }

        private void checkOwnership(Order order, Customer customer) {
                if (!order.getCustomer().getUserId().equals(customer.getUserId())) {
                        throw new RuntimeException("Access denied");
                }
        }

        private OrderStatus getOrderStatus(OrderStatusName statusName) {
                return orderStatusRepository.findByOrderStatusName(statusName.name())
                                .orElseThrow(() -> new RuntimeException("Order status not found"));
        }

        private PaymentStatus getPaymentStatus(PaymentStatusName name) {
                return paymentStatusRepository.findByPaymentStatusName(name.name())
                                .orElseThrow(() -> new RuntimeException("Payment status not found"));
        }

        @Override
        public OrderResponse checkout(OrderRequest request) {

                Customer customer = getCurrentCustomer();

                Cart cart = cartRepository.findByCustomerUserId(customer.getUserId())
                                .orElseThrow();

                PaymentMethod paymentMethod = paymentMethodRepository.findById(request.getPaymentMethodId())
                                .orElseThrow();

                Voucher voucher = null;

                if (request.getVoucherId() != null) {
                        voucher = voucherRepository.findById(request.getVoucherId())
                                        .orElseThrow(() -> new RuntimeException("Voucher not found"));
                }

                OrderStatus pending = getOrderStatus(OrderStatusName.PENDING);

                PaymentStatus unpaid = getPaymentStatus(PaymentStatusName.UNPAID);

                Order order = new Order();
                order.setCustomer(customer);
                order.setOrderReceiver(request.getOrderReceiver());
                order.setOrderReceiverPhone(request.getOrderReceiverPhone());
                order.setPaymentMethod(paymentMethod);
                order.setVoucher(voucher);
                order.setOrderStatus(pending);
                order.setPaymentStatus(unpaid);

                if (request.getProductIds() == null || request.getProductIds().isEmpty()) {
                        throw new RuntimeException("No products selected");
                }

                List<OrderItem> items = new ArrayList<>();

                for (Integer productId : request.getProductIds()) {

                        CartItem cartItem = cartItemRepository
                                        .findById(new CartItemId(cart.getCartId(), productId))
                                        .orElseThrow();

                        Product product = productRepository.findById(productId)
                                        .orElseThrow();

                        // Kiểm tra tồn kho
                        if (product.getInventory() < cartItem.getQuantity()) {
                                throw new RuntimeException(
                                                product.getProductName() + " is out of stock");
                        }

                        // Trừ kho
                        product.setInventory(
                                        product.getInventory() - cartItem.getQuantity());

                        productRepository.save(product);

                        OrderItem item = new OrderItem();
                        item.setOrder(order);
                        item.setProduct(product);
                        item.setQuantity(cartItem.getQuantity());
                        item.setPurchasedPrice(product.getProductPrice());

                        items.add(item);

                        cartItemRepository.delete(cartItem);
                }

                order.setOrderItems(items);

                Order savedOrder = orderRepository.save(order);

                Invoice invoice = new Invoice();

                invoice.setOrder(
                                savedOrder);

                invoiceRepository.save(
                                invoice);

                return orderMapper.toResponse(
                                savedOrder);
        }

        @Override
        public OrderResponse getById(Integer id) {

                Customer customer = getCurrentCustomer();

                Order order = orderRepository.findById(id)
                                .orElseThrow();

                checkOwnership(order, customer);

                return orderMapper.toResponse(order);
        }

        @Override
        public List<OrderResponse> getMyOrders() {

                Customer customer = getCurrentCustomer();

                return orderRepository.findByCustomerUserId(customer.getUserId())
                                .stream()
                                .map(orderMapper::toResponse)
                                .toList();
        }

        @Override
        public OrderResponse cancel(Integer id) {

                Customer customer = getCurrentCustomer();

                Order order = orderRepository.findById(id)
                                .orElseThrow();

                checkOwnership(order, customer);

                OrderStatus cancelled = getOrderStatus(OrderStatusName.CANCELLED);

                for (OrderItem item : order.getOrderItems()) {
                        Product product = item.getProduct();

                        product.setInventory(
                                        product.getInventory() + item.getQuantity());
                }

                if (order.getOrderStatus().getOrderStatusName()
                                .equals(OrderStatusName.CANCELLED.name())) {
                        throw new RuntimeException("Order already cancelled");
                }

                if (!order.getOrderStatus()
                                .getOrderStatusName()
                                .equals(OrderStatusName.PENDING.name())) {
                        throw new RuntimeException("Order cannot be cancelled");
                }

                
                order.setOrderStatus(cancelled);

                return orderMapper.toResponse(orderRepository.save(order));
        }

        public OrderResponse pay(Integer orderId) {

                Customer customer = getCurrentCustomer();

                Order order = orderRepository.findById(orderId)
                                .orElseThrow();

                checkOwnership(order, customer);

                if (!order.getPaymentMethod().getOnline()) {
                        throw new RuntimeException(
                                        "COD order cannot be paid online");
                }

                order.setPaymentStatus(
                                getPaymentStatus(PaymentStatusName.PAID));

                return orderMapper.toResponse(
                                orderRepository.save(order));
        }
}