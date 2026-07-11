package ctu.student.regreen.service.interfaces;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import ctu.student.regreen.dto.response.KnowledgeDocumentDetailResponse;
import ctu.student.regreen.dto.response.KnowledgeDocumentResponse;
import ctu.student.regreen.dto.response.KnowledgeStatisticsResponse;
import ctu.student.regreen.dto.response.UploadDocumentResponse;

public interface DocumentService {

    UploadDocumentResponse uploadDocument(
            MultipartFile file);

    List<KnowledgeDocumentResponse> getDocuments();

    KnowledgeStatisticsResponse getStatistics();

    KnowledgeDocumentDetailResponse getDocument(UUID documentId);

    void deleteDocument(UUID documentId);

}