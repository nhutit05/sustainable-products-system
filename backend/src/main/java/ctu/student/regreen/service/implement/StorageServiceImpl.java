package ctu.student.regreen.service.implement;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.http.HttpMethod;
import org.springframework.web.util.UriUtils;
import java.nio.charset.StandardCharsets;

import ctu.student.regreen.config.SupabaseProperties;
import ctu.student.regreen.dto.response.UploadFileResponse;
import ctu.student.regreen.service.interfaces.StorageService;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StorageServiceImpl implements StorageService {

        private final SupabaseProperties supabaseProperties;

        @Override
        public UploadFileResponse upload(MultipartFile file) {

                validate(file);

                try {

                        String objectName = UUID.randomUUID()
                                        + "_"
                                        + file.getOriginalFilename();

                        String endpoint = supabaseProperties.getUrl()
                                        + "/storage/v1/object/"
                                        + supabaseProperties.getStorage().getBucket()
                                        + "/"
                                        + objectName;

                        RestClient.create()
                                        .post()
                                        .uri(endpoint)
                                        .header(
                                                        HttpHeaders.AUTHORIZATION,
                                                        "Bearer " + supabaseProperties.getServiceKey())
                                        .header(
                                                        "apikey",
                                                        supabaseProperties.getServiceKey())
                                        .contentType(
                                                        MediaType.parseMediaType(
                                                                        file.getContentType()))
                                        .body(file.getBytes())
                                        .retrieve()
                                        .toBodilessEntity();

                        return UploadFileResponse.builder()
                                        .fileName(file.getOriginalFilename())
                                        .storagePath(objectName)
                                        .size(file.getSize())
                                        .build();

                } catch (IOException | RuntimeException e) {

                        throw new RuntimeException(
                                        "Upload failed",
                                        e);
                }
        }

        private void validate(MultipartFile file) {

                if (file == null || file.isEmpty()) {
                        throw new RuntimeException("File is empty");
                }

                String fileName = file.getOriginalFilename();

                if (fileName == null) {
                        throw new RuntimeException(
                                        "Invalid file name");
                }

                String lower = fileName.toLowerCase();

                boolean valid = lower.endsWith(".pdf")
                                || lower.endsWith(".docx");

                if (!valid) {
                        throw new RuntimeException(
                                        "Only PDF and DOCX are supported");
                }
        }

        @Override
        public void delete(String storagePath) {

                try {

                        String encodedPath = UriUtils.encodePath(storagePath, StandardCharsets.UTF_8);

                        String endpoint = supabaseProperties.getUrl()
                                        + "/storage/v1/object/"
                                        + supabaseProperties.getStorage().getBucket()
                                        + "/"
                                        + encodedPath;

                        RestClient.create()
                                        .method(HttpMethod.DELETE)
                                        .uri(endpoint)
                                        .header(
                                                        HttpHeaders.AUTHORIZATION,
                                                        "Bearer " + supabaseProperties.getServiceKey())
                                        .header(
                                                        "apikey",
                                                        supabaseProperties.getServiceKey())
                                        .retrieve()
                                        .toBodilessEntity();

                } catch (Exception e) {

                        throw new RuntimeException(
                                        "Failed to delete file from Supabase Storage",
                                        e);
                }
        }

}