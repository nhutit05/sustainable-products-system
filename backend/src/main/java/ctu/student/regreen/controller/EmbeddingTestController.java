package ctu.student.regreen.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ctu.student.regreen.service.interfaces.EmbeddingService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class EmbeddingTestController {

    private final EmbeddingService embeddingService;

    @GetMapping("/embedding")
    public int embedding() {

        float[] vector =
                embeddingService.embed(
                        "Hello ReGreen"
                );

        return vector.length;

    }
}