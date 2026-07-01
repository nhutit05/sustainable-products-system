package ctu.student.regreen.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

public interface DocumentParserService {

    String extractText(MultipartFile file);

}