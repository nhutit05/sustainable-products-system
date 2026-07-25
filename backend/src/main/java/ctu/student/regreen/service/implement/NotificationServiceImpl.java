package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
    public List<NotificationResponse> getMyNotifications(int page, int size) {

        Integer userId = getCurrentUserId();

        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        return notificationRepository
                .findByUserUserIdOrderByCreatedAtDesc(userId, pageable)
                .getContent()
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
    public void markAsRead(Integer notificationId) {

        Integer userId = getCurrentUserId();

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() -> new RuntimeException(
                        "Notification not found"));

        if (!notification.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        notification.setIsRead(true);

        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead() {

        Integer userId = getCurrentUserId();

        notificationRepository.markAllAsReadByUserId(userId);
    }

    @Override
    @Transactional
    public void notifyNewVoucherToAllCustomers(Voucher voucher) {

        List<Integer> customerIds = customerRepository.findAllIds();

        if (customerIds.isEmpty()) return;

        String title = "Khuyến mãi mới: " + voucher.getCode();
        String message = "Chúng tôi có khuyến mãi mới với giảm "
                + voucher.getDiscountValue()
                + "%. Mã: " + voucher.getCode();

        String type = NotificationTypeName.NEW_VOUCHER.name();
        Integer refId = voucher.getVoucherId();
        String refType = "VOUCHER";
        for (Integer userId : customerIds) {
            notificationRepository.insertSingle(userId, title, message, type, refId, refType);
        }
    }

    @Override
    @Transactional
    public void notifyNewOrderToAdmins(Order order) {

        List<Integer> adminIds = adminRepository.findAllIds();

        if (adminIds.isEmpty()) return;

        String title = "Đơn hàng mới";
        String message = "Khách hàng " + order.getCustomer().getUsername()
                + " vừa tạo đơn hàng #" + order.getOrderId();
        String type = NotificationTypeName.NEW_ORDER.name();
        Integer refId = order.getOrderId();
        String refType = "ORDER";
        for (Integer userId : adminIds) {
            notificationRepository.insertSingle(userId, title, message, type, refId, refType);
        }
    }

    @Override
    @Transactional
    public void notifyNewRefundToAdmins(RefundSlip refundSlip) {

        List<Integer> adminIds = adminRepository.findAllIds();

        if (adminIds.isEmpty()) return;

        String title = "Yêu cầu hoàn tiền mới";
        String message = "Đơn hàng #" + refundSlip.getOrder().getOrderId()
                + " có yêu cầu hoàn tiền";
        String type = NotificationTypeName.NEW_REFUND_REQUEST.name();
        Integer refId = refundSlip.getRefundSlipId();
        String refType = "REFUND_SLIP";
        for (Integer userId : adminIds) {
            notificationRepository.insertSingle(userId, title, message, type, refId, refType);
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

        String title = "Đơn hàng #" + order.getOrderId() + " - " + statusText;
        String message = "Trạng thái đơn hàng của bạn đã thay đổi từ \""
                + getStatusText(oldStatus) + "\" sang \"" + statusText + "\"";

        notificationRepository.insertSingle(
                customerId, title, message,
                NotificationTypeName.ORDER_STATUS_CHANGED.name(),
                order.getOrderId(), "ORDER");
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
