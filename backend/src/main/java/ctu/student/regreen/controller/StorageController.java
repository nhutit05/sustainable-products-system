package ctu.student.regreen.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import ctu.student.regreen.dto.response.UploadFileResponse;
import ctu.student.regreen.service.interfaces.StorageService;

@RestController
@RequestMapping("/api/storage")
@RequiredArgsConstructor
public class StorageController {

    private final StorageService storageService;

    @PostMapping(name = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadFileResponse> upload(
            @RequestParam("file")
            MultipartFile file
    ) {

        return ResponseEntity.ok(
                storageService.upload(file)
        );
    }

     @DeleteMapping
    public ResponseEntity<Void> delete(
            @RequestParam String storagePath
    ) {

        storageService.delete(storagePath);

        return ResponseEntity.noContent().build();
    }
}