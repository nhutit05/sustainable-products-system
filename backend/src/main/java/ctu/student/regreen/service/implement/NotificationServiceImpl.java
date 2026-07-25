package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.dto.response.NotificationResponse;
import ctu.student.regreen.enums.NotificationTypeName;
import ctu.student.regreen.mapper.NotificationMapper;
import ctu.student.regreen.model.Admin;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.Notification;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.model.RefundSlip;
import ctu.student.regreen.model.User;
import ctu.student.regreen.model.Voucher;
import ctu.student.regreen.repository.AdminRepository;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.NotificationRepository;
import ctu.student.regreen.service.interfaces.NotificationService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public NotificationResponse createNotification(
            Integer userId,
            String title,
            String message,
            NotificationTypeName type,
            Integer referenceId,
            String referenceType) {

        User user = customerRepository.findById(userId)
                .map(u -> (User) u)
                .orElseGet(() -> adminRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException(
                                "User not found with id: " + userId)));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type.name());
        notification.setReferenceId(referenceId);
        notification.setReferenceType(referenceType);
        notification.setIsRead(false);

        Notification saved = notificationRepository.save(notification);
        NotificationResponse response = notificationMapper.toResponse(saved);

        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/notifications",
                response);

        return response;
    }

    @Override
    public List<NotificationResponse> getMyNotifications() {

        Integer userId = getCurrentUserId();

        return notificationRepository
                .findByUserUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    public long getUnreadCount() {

        Integer userId = getCurrentUserId();

        return notificationRepository
                .countByUserUserIdAndIsReadFalse(userId);
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(
            Integer notificationId) {

        Integer userId = getCurrentUserId();

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() -> new RuntimeException(
                        "Notification not found"));

        if (!notification.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        notification.setIsRead(true);

        return notificationMapper.toResponse(
                notificationRepository.save(notification));
    }

    @Override
    @Transactional
    public void markAllAsRead() {

        Integer userId = getCurrentUserId();

        List<Notification> unread = notificationRepository
                .findByUserUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);

        for (Notification n : unread) {
            n.setIsRead(true);
        }

        notificationRepository.saveAll(unread);
    }

    @Override
    @Transactional
    public void notifyNewVoucherToAllCustomers(Voucher voucher) {

        List<Customer> customers = customerRepository.findAll();

        for (Customer customer : customers) {
            createNotification(
                    customer.getUserId(),
                    "Khuyến mãi mới: " + voucher.getCode(),
                    "Chúng tôi có khuyến mãi mới với giảm "
                            + voucher.getDiscountValue()
                            + "%. Mã: " + voucher.getCode(),
                    NotificationTypeName.NEW_VOUCHER,
                    voucher.getVoucherId(),
                    "VOUCHER");
        }
    }

    @Override
    @Transactional
    public void notifyNewOrderToAdmins(Order order) {

        List<Admin> admins = adminRepository.findAll();

        for (Admin admin : admins) {
            createNotification(
                    admin.getUserId(),
                    "Đơn hàng mới",
                    "Khách hàng " + order.getCustomer().getUsername()
                            + " vừa tạo đơn hàng #"
                            + order.getOrderId(),
                    NotificationTypeName.NEW_ORDER,
                    order.getOrderId(),
                    "ORDER");
        }
    }

    @Override
    @Transactional
    public void notifyNewRefundToAdmins(RefundSlip refundSlip) {

        List<Admin> admins = adminRepository.findAll();

        for (Admin admin : admins) {
            createNotification(
                    admin.getUserId(),
                    "Yêu cầu hoàn tiền mới",
                    "Đơn hàng #"
                            + refundSlip.getOrder().getOrderId()
                            + " có yêu cầu hoàn tiền",
                    NotificationTypeName.NEW_REFUND_REQUEST,
                    refundSlip.getRefundSlipId(),
                    "REFUND_SLIP");
        }
    }

    @Override
    @Transactional
    public void notifyOrderStatusChanged(
            Order order,
            String oldStatus,
            String newStatus) {

        Integer customerId = order.getCustomer().getUserId();

        String statusText = getStatusText(newStatus);

        createNotification(
                customerId,
                "Đơn hàng #" + order.getOrderId() + " - " + statusText,
                "Trạng thái đơn hàng của bạn đã thay đổi từ \""
                        + getStatusText(oldStatus) + "\" sang \"" + statusText + "\"",
                NotificationTypeName.ORDER_STATUS_CHANGED,
                order.getOrderId(),
                "ORDER");
    }

    private Integer getCurrentUserId() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return customerRepository.findByUsername(username)
                .map(Customer::getUserId)
                .orElseGet(() -> adminRepository.findByUsername(username)
                        .map(Admin::getUserId)
                        .orElseThrow(() -> new RuntimeException(
                                "User not found")));
    }

    private String getStatusText(String statusName) {

        return switch (statusName) {
            case "PENDING" -> "Đang chờ xử lý";
            case "CONFIRMED" -> "Đã xác nhận";
            case "SHIPPING" -> "Đang giao hàng";
            case "COMPLETED" -> "Đã hoàn thành";
            case "CANCELLED" -> "Đã hủy";
            default -> statusName;
        };
    }
}
