package ctu.student.regreen.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NotificationSummaryResponse {

    private List<NotificationResponse> notifications;

    private long unreadCount;
}
