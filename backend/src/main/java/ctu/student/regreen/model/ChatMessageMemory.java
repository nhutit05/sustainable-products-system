package ctu.student.regreen.model;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageMemory {

    private String role; // user / assistant
    private String content;
    private LocalDateTime timestamp;
}