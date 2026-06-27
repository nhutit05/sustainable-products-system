package ctu.student.regreen.service.implement.parser;


import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import ctu.student.regreen.enums.DocumentType;
import ctu.student.regreen.exception.DocumentParseException;
import ctu.student.regreen.service.interfaces.DocumentParser;

@Service
@Slf4j
public class PdfDocumentParser implements DocumentParser {

    @Override
    public boolean supports(DocumentType documentType) {

        return documentType == DocumentType.PDF;

    }

    @Override
    public String extractText(MultipartFile file) {

        try (PDDocument document =
                     Loader.loadPDF(file.getBytes())) {

            PDFTextStripper stripper =
                    new PDFTextStripper();

            String content =
                    stripper.getText(document);

            log.info(
                    "Extracted {} characters from PDF {}",
                    content.length(),
                    file.getOriginalFilename()
            );

            return content;

        } catch (Exception ex) {

            throw new DocumentParseException(
                    "Cannot parse PDF",
                    ex
            );

        }

    }

}