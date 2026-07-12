package ctu.student.regreen.service.interfaces;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import ctu.student.regreen.dto.response.KnowledgeDocumentDetailResponse;
import ctu.student.regreen.dto.response.KnowledgeDocumentResponse;
import ctu.student.regreen.dto.response.KnowledgeStatisticsResponse;
import ctu.student.regreen.dto.response.PageResponse;
import ctu.student.regreen.dto.response.UploadDocumentResponse;
import ctu.student.regreen.enums.DocumentStatus;

public interface DocumentService {

    UploadDocumentResponse uploadDocument(
            MultipartFile file);

    // List<KnowledgeDocumentResponse> getDocuments();
    PageResponse<KnowledgeDocumentResponse> getDocuments(
        int page,
        int size,
        String keyword,
        DocumentStatus status
);

    KnowledgeStatisticsResponse getStatistics();

    KnowledgeDocumentDetailResponse getDocument(UUID documentId);

    void deleteDocument(UUID documentId);

}