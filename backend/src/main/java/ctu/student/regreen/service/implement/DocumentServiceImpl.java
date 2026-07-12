package ctu.student.regreen.service.implement;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import ctu.student.regreen.dto.response.KnowledgeDocumentDetailResponse;
import ctu.student.regreen.dto.response.KnowledgeDocumentResponse;
import ctu.student.regreen.dto.response.KnowledgeStatisticsResponse;
import ctu.student.regreen.dto.response.PageResponse;
import ctu.student.regreen.dto.response.UploadDocumentResponse;
import ctu.student.regreen.enums.DocumentStatus;
import ctu.student.regreen.mapper.DocumentMapper;
import ctu.student.regreen.model.Document;
import ctu.student.regreen.repository.DocumentChunkRepository;
import ctu.student.regreen.repository.DocumentContentRepository;
import ctu.student.regreen.repository.DocumentRepository;
import ctu.student.regreen.service.interfaces.DocumentIngestionService;
import ctu.student.regreen.service.interfaces.DocumentService;
import ctu.student.regreen.service.interfaces.StorageService;
// import jakarta.transaction.Transactional;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl
                implements DocumentService {

        private final DocumentIngestionService ingestionService;

        private final DocumentRepository documentRepository;

        private final DocumentChunkRepository documentChunkRepository;

        private final StorageService storageService;

        private final DocumentMapper documentMapper;

        @Override
        public UploadDocumentResponse uploadDocument(
                        MultipartFile file) {

                return ingestionService.ingest(file);

        }

        // @Override
        // @Transactional(readOnly = true)
        // public List<KnowledgeDocumentResponse> getDocuments() {

        // List<Document> documents =
        // documentRepository.findAllByOrderByUploadedAtDesc();

        // return documents.stream()
        // .map(document -> {

        // int chunkCount = documentChunkRepository.countByDocument_Id(
        // document.getId());

        // return documentMapper.toKnowledgeDocumentResponse(
        // document,
        // chunkCount);

        // })
        // .toList();

        // }

        @Override
        @Transactional(readOnly = true)

        public PageResponse<KnowledgeDocumentResponse> getDocuments(
                        int page,
                        int size,
                String keyword,
        DocumentStatus status) {

                Pageable pageable = PageRequest.of(
                                page,
                                size,
                                Sort.by("uploadedAt").descending());
               if (keyword == null) {
    keyword = "";
}

keyword = keyword.trim();


                Page<Document> documentPage =
        documentRepository.searchDocuments(
                keyword,
                status,
                pageable
        );
                List<KnowledgeDocumentResponse> responses = documentPage.getContent()
                                .stream()
                                .map(document -> {

                                        int chunkCount = documentChunkRepository.countByDocument_Id(
                                                        document.getId());

                                        return documentMapper.toKnowledgeDocumentResponse(
                                                        document,
                                                        chunkCount);
                                })
                                .toList();
                return PageResponse.<KnowledgeDocumentResponse>builder()

                                .content(responses)

                                .page(documentPage.getNumber())

                                .size(documentPage.getSize())

                                .totalElements(documentPage.getTotalElements())

                                .totalPages(documentPage.getTotalPages())

                                .last(documentPage.isLast())

                                .build();
        }

        @Override
        @Transactional(readOnly = true)
        public KnowledgeStatisticsResponse getStatistics() {

                return KnowledgeStatisticsResponse.builder()
                                .totalDocuments(documentRepository.count())
                                .totalChunks(documentChunkRepository.count())
                                .embeddedDocuments(
                                                documentRepository.countByStatus(
                                                                DocumentStatus.EMBEDDED))
                                .failedDocuments(
                                                documentRepository.countByStatus(
                                                                DocumentStatus.FAILED))
                                .build();

        }

        @Override
        @Transactional(readOnly = true)
        public KnowledgeDocumentDetailResponse getDocument(
                        UUID documentId) {

                Document document = documentRepository.findById(documentId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Document not found"));

                int chunkCount = documentChunkRepository.countByDocument_Id(
                                documentId);

                return documentMapper
                                .toKnowledgeDocumentDetailResponse(
                                                document,
                                                chunkCount);

        }

        @Override
        @Transactional
        public void deleteDocument(
                        UUID documentId) {

                Document document = documentRepository.findById(documentId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Document not found"));

                storageService.delete(
                                document.getStoragePath());

                documentRepository.delete(document);

        }

}
