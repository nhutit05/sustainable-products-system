package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ctu.student.regreen.model.DocumentChunk;
import ctu.student.regreen.service.interfaces.EmbeddingService;
import ctu.student.regreen.service.interfaces.SimilaritySearchService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/test/search")
@RequiredArgsConstructor
public class TestSearchController {

    private final EmbeddingService embeddingService;
    private final SimilaritySearchService similaritySearchService;

    @GetMapping
    public List<DocumentChunk> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "5") int topK
    ) {

        float[] embedding =
                embeddingService.embed(q);

        return similaritySearchService.search(
                embedding,
                topK
        );
    }
}