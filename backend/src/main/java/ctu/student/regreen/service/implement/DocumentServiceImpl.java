package ctu.student.regreen.service.implement;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import ctu.student.regreen.dto.response.UploadDocumentResponse;
import ctu.student.regreen.service.interfaces.DocumentIngestionService;
import ctu.student.regreen.service.interfaces.DocumentService;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl
                implements DocumentService {

        private final DocumentIngestionService ingestionService;

        @Override
        public UploadDocumentResponse uploadDocument(
                        MultipartFile file) {

                return ingestionService.ingest(file);

        }

}
