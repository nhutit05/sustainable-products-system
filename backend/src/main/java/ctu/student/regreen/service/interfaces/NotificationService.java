package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.dto.response.NotificationResponse;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.model.RefundSlip;
import ctu.student.regreen.model.Voucher;

public interface NotificationService {

    List<NotificationResponse> getMyNotifications(int page, int size);

    long getUnreadCount();

    void markAsRead(Integer notificationId);

    void markAllAsRead();

    void notifyNewVoucherToAllCustomers(Voucher voucher);

    void notifyNewOrderToAdmins(Order order);

    void notifyNewRefundToAdmins(RefundSlip refundSlip);

    void notifyOrderStatusChanged(Order order, String oldStatus, String newStatus);
}
