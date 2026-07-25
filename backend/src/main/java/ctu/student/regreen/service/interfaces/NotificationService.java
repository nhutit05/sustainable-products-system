package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.dto.response.NotificationResponse;
import ctu.student.regreen.enums.NotificationTypeName;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.model.RefundSlip;
import ctu.student.regreen.model.Voucher;

public interface NotificationService {

    NotificationResponse createNotification(Integer userId, String title, String message,
                                           NotificationTypeName type, Integer referenceId,
                                           String referenceType);

    List<NotificationResponse> getMyNotifications();

    long getUnreadCount();

    NotificationResponse markAsRead(Integer notificationId);

    void markAllAsRead();

    void notifyNewVoucherToAllCustomers(Voucher voucher);

    void notifyNewOrderToAdmins(Order order);

    void notifyNewRefundToAdmins(RefundSlip refundSlip);

    void notifyOrderStatusChanged(Order order, String oldStatus, String newStatus);
}
