package ctu.student.regreen.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import ctu.student.regreen.enums.DocumentStatus;
import ctu.student.regreen.enums.DocumentType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class KnowledgeDocumentResponse {

    private UUID documentId;

    private String fileName;

    private DocumentType documentType;

    private Long fileSize;

    private LocalDateTime uploadedAt;

    private DocumentStatus status;

    private int chunkCount;

    private int characterCount;

    private int wordCount;

}