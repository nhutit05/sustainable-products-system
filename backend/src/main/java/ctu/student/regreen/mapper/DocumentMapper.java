package ctu.student.regreen.mapper;

import org.springframework.stereotype.Component;

import ctu.student.regreen.dto.response.KnowledgeDocumentDetailResponse;
import ctu.student.regreen.dto.response.KnowledgeDocumentResponse;
import ctu.student.regreen.model.Document;

@Component
public class DocumentMapper {

    public KnowledgeDocumentResponse toKnowledgeDocumentResponse(
            Document document,
            int chunkCount) {

        return KnowledgeDocumentResponse.builder()
                .documentId(document.getId())
                .fileName(document.getOriginalFileName())
                .documentType(document.getDocumentType())
                .fileSize(document.getFileSize())
                .uploadedAt(document.getUploadedAt())
                .status(document.getStatus())
                .chunkCount(chunkCount)
                .characterCount(document.getDocumentContent().getCharacterCount())
                .wordCount(document.getDocumentContent().getWordCount())
                .build();

    }

    public KnowledgeDocumentDetailResponse toKnowledgeDocumentDetailResponse(
            Document document,
            int chunkCount) {

        String content = document.getDocumentContent().getContent();

        String preview = content.length() > 500
                ? content.substring(0, 500) + "..."
                : content;

        return KnowledgeDocumentDetailResponse.builder()
                .documentId(document.getId())
                .fileName(document.getOriginalFileName())
                .documentType(document.getDocumentType())
                .fileSize(document.getFileSize())
                .uploadedAt(document.getUploadedAt())
                .status(document.getStatus())
                .chunkCount(chunkCount)
                .characterCount(document.getDocumentContent().getCharacterCount())
                .wordCount(document.getDocumentContent().getWordCount())
                .preview(preview)
                .build();

    }

}