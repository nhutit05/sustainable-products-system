package ctu.student.regreen.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "document_contents")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentContent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "document_id",
            nullable = false,
            unique = true
    )
    private Document document;

    @Column(
            columnDefinition = "TEXT",
            nullable = false
    )
    private String content;

    @Column(nullable = false)
    private Integer characterCount;

    @Column(nullable = false)
    private Integer wordCount;

    @Column(nullable = false)
    private LocalDateTime extractedAt;

}