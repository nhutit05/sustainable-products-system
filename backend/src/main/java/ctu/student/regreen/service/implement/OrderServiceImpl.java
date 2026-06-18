package ctu.student.regreen.service.implement;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import ctu.student.regreen.dto.request.OrderRequest;
import ctu.student.regreen.dto.response.OrderResponse;
import ctu.student.regreen.enums.OrderStatusName;
import ctu.student.regreen.mapper.OrderMapper;
import ctu.student.regreen.model.Cart;
import ctu.student.regreen.model.CartItem;
import ctu.student.regreen.model.CartItemId;
import ctu.student.regreen.model.Customer;
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
import ctu.student.regreen.repository.OrderItemRepository;
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

        private final OrderMapper orderMapper;

        private Customer getCurrentCustomer() {

                String username = SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getName();

                return customerRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new RuntimeException(
                                                "Customer not found"));
        }

        private OrderStatus getOrderStatus(
                        OrderStatusName statusName) {

                return orderStatusRepository
                                .findByOrderStatusName(
                                                statusName.name())
                                .orElseThrow(() -> new RuntimeException(
                                                "Order status not found"));
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

                        voucher = voucherRepository
                                        .findById(
                                                        request.getVoucherId())
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Voucher not found"));
                }

                OrderStatus pending = getOrderStatus(
                                OrderStatusName.PENDING);
                PaymentStatus unpaid = paymentStatusRepository.findById(1).orElseThrow();

                Order order = new Order();
                order.setCustomer(customer);
                order.setOrderReceiver(request.getOrderReceiver());
                order.setOrderReceiverPhone(request.getOrderReceiverPhone());
                order.setPaymentMethod(paymentMethod);
                order.setVoucher(voucher);
                order.setOrderStatus(pending);
                order.setPaymentStatus(unpaid);

                List<OrderItem> items = new ArrayList<>();

                if (request.getProductIds() == null
                                || request.getProductIds().isEmpty()) {

                        throw new RuntimeException(
                                        "No products selected");
                }

                for (Integer productId : request.getProductIds()) {

                        CartItem cartItem = cartItemRepository
                                        .findById(new CartItemId(cart.getCartId(), productId))
                                        .orElseThrow();

                        Product product = productRepository.findById(productId)
                                        .orElseThrow();

                        OrderItem item = new OrderItem();

                        // IMPORTANT: KHÔNG SET ID MANUAL
                        item.setOrder(order);
                        item.setProduct(product);
                        item.setQuantity(cartItem.getQuantity());
                        item.setPurchasedPrice(product.getProductPrice());

                        items.add(item);

                        cartItemRepository.delete(cartItem);
                }

                order.setOrderItems(items);

                orderRepository.save(order);

                return orderMapper.toResponse(order);
        }

        @Override
        public OrderResponse getById(Integer id) {

                String username = SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getName();

                Customer customer = customerRepository
                                .findByUsername(username)
                                .orElseThrow();

                Order order = orderRepository
                                .findById(id)
                                .orElseThrow();

                if (!order.getCustomer()
                                .getUserId()
                                .equals(customer.getUserId())) {

                        throw new RuntimeException(
                                        "Access denied");
                }

                return orderMapper.toResponse(order);
        }

        @Override
        public List<OrderResponse> getMyOrders() {

                String username = SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getName();

                Customer customer = customerRepository
                                .findByUsername(username)
                                .orElseThrow();

                return orderRepository
                                .findByCustomerUserId(
                                                customer.getUserId())
                                .stream()
                                .map(orderMapper::toResponse)
                                .toList();
        }

        @Override
        public OrderResponse cancel(Integer id) {

                String username = SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getName();

                Customer customer = customerRepository
                                .findByUsername(username)
                                .orElseThrow();

                Order order = orderRepository.findById(id).orElseThrow();

                if (!order.getCustomer()
                                .getUserId()
                                .equals(customer.getUserId())) {

                        throw new RuntimeException(
                                        "Access denied");
                }

                OrderStatus cancelled = orderStatusRepository.findById(5).orElseThrow();

                order.setOrderStatus(cancelled);

                return orderMapper.toResponse(orderRepository.save(order));
        }
}