package ctu.student.regreen.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
}