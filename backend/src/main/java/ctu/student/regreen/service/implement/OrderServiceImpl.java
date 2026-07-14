package ctu.student.regreen.service.implement;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.dto.request.OrderRequest;
import ctu.student.regreen.dto.response.CheckoutResponse;
import ctu.student.regreen.dto.response.OrderResponse;
import ctu.student.regreen.enums.OrderStatusName;
import ctu.student.regreen.enums.PaymentStatusName;
import ctu.student.regreen.integration.payos.dto.PayOSCheckoutResult;
import ctu.student.regreen.integration.payos.service.PayOSService;
import ctu.student.regreen.mapper.OrderMapper;
import ctu.student.regreen.model.Address;
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
import ctu.student.regreen.repository.AddressRepository;
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
// import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
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
        private final AddressRepository addressRepository;

        private final InvoiceRepository invoiceRepository;

        private final OrderMapper orderMapper;

        private final PayOSService payOSService;

        private long calculatePayableAmount(Order order) {

                long total = 0;

                for (OrderItem item : order.getOrderItems()) {

                        long price = Math.round(item.getPurchasedPrice());

                        total += price * item.getQuantity();
                }

                if (order.getVoucher() != null) {
                        total = total - Math.round(total * order.getVoucher().getDiscountValue() / 100.0);
                }

                return total;
        }

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

        private Address getAddress(Integer addressId) {
                return addressRepository.findById(addressId)
                                .orElseThrow(() -> new RuntimeException("Address not found"));
        }

        private PayOSCheckoutResult processOnlinePayment(Order order) {

                if (!order.getPaymentMethod().getOnline()) {
                        return null;
                }

                long payableAmount = calculatePayableAmount(order);

                PayOSCheckoutResult checkout = payOSService.createCheckout(
                                order,
                                payableAmount);

                order.setPayOSOrderCode(
                                checkout.getPayOSOrderCode());

                orderRepository.save(order);

                return checkout;
        }

        private CheckoutResponse buildCheckoutResponse(
                        Order order,
                        PayOSCheckoutResult checkout) {

                return CheckoutResponse.builder()
                                .order(orderMapper.toResponse(order))
                                .checkoutUrl(
                                                checkout != null
                                                                ? checkout.getCheckoutUrl()
                                                                : null)
                                .qrCode(
                                                checkout != null
                                                                ? checkout.getQrCode()
                                                                : null)
                                .expiredAt(
                                                checkout != null
                                                                ? checkout.getExpiredAt()
                                                                : null)
                                .build();
        }

        private void createInvoice(Order order) {

                Invoice invoice = new Invoice();

                invoice.setOrder(order);

                invoiceRepository.save(invoice);
        }

        @Override
        @Transactional
        public CheckoutResponse checkout(OrderRequest request) {

                Customer customer = getCurrentCustomer();

                Cart cart = cartRepository.findByCustomerUserId(customer.getUserId())
                                .orElseThrow();

                PaymentMethod paymentMethod = paymentMethodRepository.findById(request.getPaymentMethodId())
                                .orElseThrow();

                Voucher voucher = null;

                if (request.getVoucherId() != null) {
                        voucher = voucherRepository.findByVoucherIdAndIsActiveTrue(request.getVoucherId())
                                        .orElseThrow(() -> new RuntimeException("Voucher not found"));
                }

                OrderStatus pending = getOrderStatus(OrderStatusName.PENDING);

                PaymentStatus unpaid = getPaymentStatus(PaymentStatusName.UNPAID);

                String address = getAddress(request.getAddressId()).toString();

                Order order = new Order();
                order.setCustomer(customer);
                order.setOrderReceiver(request.getOrderReceiver());
                order.setOrderReceiverPhone(request.getOrderReceiverPhone());
                order.setOrderAddress(address);
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

                Integer accummulatedEcoPoints = 0;

                for (OrderItem item : savedOrder.getOrderItems()) {
                        accummulatedEcoPoints += item.getProduct().getBaseEcoPoints() * item.getQuantity();
                }

                customer.setAccumulatedEcoPoints(customer.getAccumulatedEcoPoints() + accummulatedEcoPoints);

                if (voucher != null) {
                        voucher.setQuantity(voucher.getQuantity() - 1);
                }

                PayOSCheckoutResult checkout = processOnlinePayment(savedOrder);

                createInvoice(savedOrder);

                return buildCheckoutResponse(savedOrder, checkout);
        }

        @Override
        @Transactional
        public CheckoutResponse repay(Integer orderId) {
                Customer customer = getCurrentCustomer();

                Order oldOrder = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found."));

                checkOwnership(oldOrder, customer);

                if (!oldOrder.getPaymentMethod().getOnline()) {
                        throw new RuntimeException("This order is not online payment.");
                }

                if (!PaymentStatusName.FAILED.name()
                                .equals(oldOrder.getPaymentStatus().getPaymentStatusName())) {
                        throw new RuntimeException("Order cannot be repaid.");
                }

                if (!OrderStatusName.CANCELLED.name()
                                .equals(oldOrder.getOrderStatus().getOrderStatusName())) {
                        throw new RuntimeException("Order cannot be repaid.");
                }

                Order newOrder = new Order();

                newOrder.setCustomer(oldOrder.getCustomer());

                newOrder.setOrderReceiver(oldOrder.getOrderReceiver());

                newOrder.setOrderReceiverPhone(oldOrder.getOrderReceiverPhone());

                newOrder.setPaymentMethod(oldOrder.getPaymentMethod());

                newOrder.setOrderAddress((oldOrder.getOrderAddress()));

                newOrder.setVoucher(oldOrder.getVoucher());

                newOrder.setOrderStatus(
                                getOrderStatus(OrderStatusName.PENDING));

                newOrder.setPaymentStatus(
                                getPaymentStatus(PaymentStatusName.UNPAID));

                List<OrderItem> items = new ArrayList<>();

                for (OrderItem oldItem : oldOrder.getOrderItems()) {

                        Product product = productRepository
                                        .findById(oldItem.getProduct().getProductId())
                                        .orElseThrow();

                        if (product.getInventory() < oldItem.getQuantity()) {
                                throw new RuntimeException(
                                                product.getProductName() + " is out of stock");
                        }

                        product.setInventory(
                                        product.getInventory() - oldItem.getQuantity());

                        productRepository.save(product);

                        OrderItem newItem = new OrderItem();

                        newItem.setOrder(newOrder);

                        newItem.setProduct(product);

                        newItem.setQuantity(oldItem.getQuantity());

                        newItem.setPurchasedPrice(oldItem.getPurchasedPrice());

                        items.add(newItem);
                }

                newOrder.setOrderItems(items);

                Order savedOrder = orderRepository.save(newOrder);

                PayOSCheckoutResult checkout = processOnlinePayment(savedOrder);

                createInvoice(savedOrder);

                return buildCheckoutResponse(
                                savedOrder,
                                checkout);
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
        @Transactional
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