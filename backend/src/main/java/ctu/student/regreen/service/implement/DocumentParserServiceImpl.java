package ctu.student.regreen.service.implement;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import ctu.student.regreen.enums.DocumentType;
import ctu.student.regreen.exception.UnsupportedDocumentTypeException;
import ctu.student.regreen.service.interfaces.DocumentParser;
import ctu.student.regreen.service.interfaces.DocumentParserService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentParserServiceImpl
        implements DocumentParserService {

    private final List<DocumentParser> parsers;

    @Override
    public String extractText(MultipartFile file) {

        DocumentType documentType =
                detectDocumentType(file);

        DocumentParser parser =
                parsers.stream()
                        .filter(p -> p.supports(documentType))
                        .findFirst()
                        .orElseThrow(() ->
                                new UnsupportedDocumentTypeException(
                                        "Unsupported document type: "
                                                + documentType
                                ));

        return parser.extractText(file);

    }

    private DocumentType detectDocumentType(
            MultipartFile file
    ) {

        String fileName =
                file.getOriginalFilename();

        if (fileName == null) {
            throw new RuntimeException(
                    "File name is null"
            );
        }

        fileName =
                fileName.toLowerCase();

        if (fileName.endsWith(".pdf")) {

            return DocumentType.PDF;

        }

        if (fileName.endsWith(".docx")) {

            return DocumentType.DOCX;

        }

        throw new UnsupportedDocumentTypeException(
                "Unsupported document type"
        );

    }

}