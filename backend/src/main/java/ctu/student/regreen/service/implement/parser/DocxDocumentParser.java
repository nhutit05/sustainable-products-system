package ctu.student.regreen.service.implement.parser;

import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import ctu.student.regreen.enums.DocumentType;
import ctu.student.regreen.exception.DocumentParseException;
import ctu.student.regreen.service.interfaces.DocumentParser;

import java.util.stream.Collectors;

@Service
@Slf4j
public class DocxDocumentParser implements DocumentParser {

    @Override
    public boolean supports(DocumentType documentType) {

        return documentType == DocumentType.DOCX;

    }

    @Override
    public String extractText(MultipartFile file) {

        try (XWPFDocument document =
                     new XWPFDocument(file.getInputStream())) {

            String content =
                    document.getParagraphs()
                            .stream()
                            .map(p -> p.getText())
                            .collect(Collectors.joining("\n"));

            log.info(
                    "Extracted {} characters from DOCX {}",
                    content.length(),
                    file.getOriginalFilename()
            );

            return content;

        } catch (Exception ex) {

            throw new DocumentParseException(
                    "Cannot parse DOCX",
                    ex
            );

        }

    }

}