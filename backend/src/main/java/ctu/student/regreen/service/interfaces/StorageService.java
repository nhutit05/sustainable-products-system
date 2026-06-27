package ctu.student.regreen.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

import ctu.student.regreen.dto.response.UploadFileResponse;

public interface StorageService {

    UploadFileResponse upload(MultipartFile file);
    void delete(String storagePath);

}