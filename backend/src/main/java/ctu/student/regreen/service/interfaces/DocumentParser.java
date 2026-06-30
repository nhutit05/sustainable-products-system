package ctu.student.regreen.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

import ctu.student.regreen.enums.DocumentType;

public interface DocumentParser {

    /**
     * Parser này có hỗ trợ loại tài liệu này không?
     */
    boolean supports(DocumentType documentType);

    /**
     * Trích xuất text từ file.
     */
    String extractText(MultipartFile file);

}