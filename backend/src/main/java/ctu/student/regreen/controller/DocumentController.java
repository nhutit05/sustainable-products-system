package ctu.student.regreen.controller;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import ctu.student.regreen.dto.response.KnowledgeDocumentDetailResponse;
import ctu.student.regreen.dto.response.KnowledgeDocumentResponse;
import ctu.student.regreen.dto.response.KnowledgeStatisticsResponse;
import ctu.student.regreen.dto.response.UploadDocumentResponse;
import ctu.student.regreen.service.interfaces.DocumentService;

@RestController
@RequestMapping("/api/admin/knowledge")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping(name = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadDocumentResponse>
    uploadDocument(
            @RequestParam("file")
            MultipartFile file
    ) {

        return ResponseEntity.ok(
                documentService.uploadDocument(
                        file
                )
        );
    }

    @GetMapping
    public List<KnowledgeDocumentResponse> getDocuments() {

        return documentService.getDocuments();

    }

    @GetMapping("/statistics")
    public KnowledgeStatisticsResponse getStatistics() {

        return documentService.getStatistics();

    }

    @GetMapping("/{documentId}")
    public KnowledgeDocumentDetailResponse getDocument(
            @PathVariable UUID documentId) {

        return documentService.getDocument(documentId);

    }

    @DeleteMapping("/{documentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDocument(
            @PathVariable UUID documentId) {

        documentService.deleteDocument(documentId);

    }
}