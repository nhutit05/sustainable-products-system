package ctu.student.regreen.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NotificationResponse {

    private Integer notificationId;

    private String title;

    private String message;

    private String type;

    private Integer referenceId;

    private String referenceType;

    private boolean isRead;

    private LocalDateTime createdAt;
}
