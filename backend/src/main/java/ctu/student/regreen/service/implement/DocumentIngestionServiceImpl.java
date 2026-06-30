package ctu.student.regreen.service.implement;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import ctu.student.regreen.dto.response.UploadDocumentResponse;
import ctu.student.regreen.dto.response.UploadFileResponse;
import ctu.student.regreen.enums.DocumentStatus;
import ctu.student.regreen.enums.DocumentType;
import ctu.student.regreen.model.Document;
import ctu.student.regreen.model.DocumentChunk;
import ctu.student.regreen.model.DocumentContent;
import ctu.student.regreen.repository.DocumentChunkRepository;
import ctu.student.regreen.repository.DocumentContentRepository;
import ctu.student.regreen.repository.DocumentRepository;
import ctu.student.regreen.service.interfaces.ChunkService;
import ctu.student.regreen.service.interfaces.DocumentIngestionService;
import ctu.student.regreen.service.interfaces.DocumentParserService;
import ctu.student.regreen.service.interfaces.EmbeddingService;
import ctu.student.regreen.service.interfaces.StorageService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentIngestionServiceImpl
                implements DocumentIngestionService {

        private final DocumentParserService parserService;

        private final StorageService storageService;

        private final DocumentRepository documentRepository;

        private final DocumentContentRepository documentContentRepository;

        private final DocumentChunkRepository documentChunkRepository;

        private final ChunkService chunkService;

        private final EmbeddingService embeddingService;

        @Override
        @Transactional
        public UploadDocumentResponse ingest(
                        MultipartFile file) {

                /*
                 * STEP 1
                 * Parse document
                 */
                String extractedContent = parserService.extractText(file);

                int characterCount = extractedContent.length();

                int wordCount = countWords(extractedContent);

                /*
                 * STEP 2
                 * Upload to Supabase Storage
                 */
                UploadFileResponse uploadResult = storageService.upload(file);

                try {

                        /*
                         * STEP 3
                         * Save document
                         */
                        Document document = Document.builder()
                                        .originalFileName(uploadResult.getFileName())
                                        .storagePath(uploadResult.getStoragePath())
                                        .contentType(file.getContentType())
                                        .fileSize(uploadResult.getSize())
                                        .documentType(resolveDocumentType(file))
                                        .status(DocumentStatus.PARSED)
                                        .uploadedAt(LocalDateTime.now())
                                        .build();

                        document = documentRepository.save(document);

                        /*
                         * STEP 4
                         * Save extracted content
                         */
                        DocumentContent content = DocumentContent.builder()
                                        .document(document)
                                        .content(extractedContent)
                                        .characterCount(characterCount)
                                        .wordCount(wordCount)
                                        .extractedAt(LocalDateTime.now())
                                        .build();

                        documentContentRepository.save(content);

                        document.setDocumentContent(content);

                        /*
                         * STEP 5
                         * Split into chunks
                         */
                        List<String> chunks = chunkService.splitIntoChunks(
                                        extractedContent);

                        /*
                         * STEP 6
                         * Save chunks with embeddings
                         */
                        List<DocumentChunk> chunkEntities = new ArrayList<>();

                        for (int i = 0; i < chunks.size(); i++) {

                                String chunkContent = chunks.get(i);

                                float[] embedding = embeddingService.embed(chunkContent);

                                DocumentChunk chunk = DocumentChunk.builder()
                                                .document(document)
                                                .chunkIndex(i)
                                                .content(chunkContent)
                                                .characterCount(chunkContent.length())
                                                .tokenCount(0)
                                                .embedding(embedding)
                                                .createdAt(LocalDateTime.now())
                                                .build();

                                chunkEntities.add(chunk);
                        }

                        documentChunkRepository.saveAll(chunkEntities);
                        /*
                         * STEP 7
                         * Update status
                         */
                        // document.setStatus(
                        // DocumentStatus.CHUNKED);

                        document.setStatus(DocumentStatus.EMBEDDED);

                        documentRepository.save(document);

                        /*
                         * STEP 8
                         * Response
                         */
                        return UploadDocumentResponse.builder()
                                        .documentId(document.getId())
                                        .fileName(document.getOriginalFileName())
                                        .storagePath(document.getStoragePath())
                                        .size(document.getFileSize())
                                        .characterCount(characterCount)
                                        .wordCount(wordCount)
                                        .build();

                } catch (Exception ex) {

                        /*
                         * Rollback Supabase Storage
                         */
                        storageService.delete(
                                        uploadResult.getStoragePath());

                        throw ex;

                }

        }

        private int countWords(
                        String content) {

                if (content == null
                                || content.isBlank()) {
                        return 0;
                }

                return content
                                .trim()
                                .split("\\s+").length;

        }

        private DocumentType resolveDocumentType(
                        MultipartFile file) {

                String fileName = file.getOriginalFilename();

                if (fileName == null) {
                        throw new RuntimeException(
                                        "Invalid file name");
                }

                String lower = fileName.toLowerCase();

                if (lower.endsWith(".pdf")) {
                        return DocumentType.PDF;
                }

                if (lower.endsWith(".docx")) {
                        return DocumentType.DOCX;
                }

                throw new RuntimeException(
                                "Unsupported document type");

        }

}