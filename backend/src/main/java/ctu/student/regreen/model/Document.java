package ctu.student.regreen.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

import ctu.student.regreen.enums.DocumentStatus;
import ctu.student.regreen.enums.DocumentType;

@Entity
@Table(name = "documents")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String originalFileName;

    private String storagePath;

    private String contentType;

    private Long fileSize;

    @Enumerated(EnumType.STRING)
    private DocumentType documentType;

    @Enumerated(EnumType.STRING)
    private DocumentStatus status;

    private LocalDateTime uploadedAt;

    @OneToOne(mappedBy = "document", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private DocumentContent documentContent;
}