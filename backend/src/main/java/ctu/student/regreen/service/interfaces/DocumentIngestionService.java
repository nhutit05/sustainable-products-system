package ctu.student.regreen.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

import ctu.student.regreen.dto.response.UploadDocumentResponse;

public interface DocumentIngestionService {

    UploadDocumentResponse ingest(MultipartFile file);

}
