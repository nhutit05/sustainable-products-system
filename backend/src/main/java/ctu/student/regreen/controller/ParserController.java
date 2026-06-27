package ctu.student.regreen.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import ctu.student.regreen.service.interfaces.DocumentParserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/parser")
public class ParserController {

    private final DocumentParserService parserService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String parse(
            @RequestParam MultipartFile file
    ) {

        return parserService.extractText(file);

    }

}