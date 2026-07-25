package ctu.student.regreen.mapper;

import org.springframework.stereotype.Component;

import ctu.student.regreen.dto.response.NotificationResponse;
import ctu.student.regreen.model.Notification;

@Component
public class NotificationMapper {

    public NotificationResponse toResponse(Notification notification) {

        return new NotificationResponse(
                notification.getNotificationId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.getReferenceId(),
                notification.getReferenceType(),
                notification.getIsRead(),
                notification.getCreatedAt());
    }
}
