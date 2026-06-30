package ctu.student.regreen.service.implement;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.stereotype.Service;

import ctu.student.regreen.service.interfaces.EmbeddingService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;

@Service
@RequiredArgsConstructor
public class EmbeddingServiceImpl implements EmbeddingService {

    private final EmbeddingModel embeddingModel;

    @Override
    @Cacheable(value = "embeddings", key = "#text == null ? '' : #text.trim().toLowerCase()")
    public float[] embed(String text) {

        text = normalize(text);

        if (text.isBlank()) {
            throw new RuntimeException("Cannot embed empty text.");
        }

        try {
            System.out.println("CALL GEMINI EMBEDDING");

            float[] result = embeddingModel.embed(text);

            if (result == null || result.length == 0) {
                throw new RuntimeException("Empty embedding result");
            }

            return result;

        } catch (Exception ex) {
            throw new RuntimeException("Embedding failed", ex);
        }
    }

    private String normalize(String text) {

        if (text == null) {
            return "";
        }

        return text.trim().toLowerCase();
    }
}

// @Service
// @RequiredArgsConstructor
// public class EmbeddingServiceImpl implements EmbeddingService {

// private final EmbeddingModel embeddingModel;

// @Override
// public float[] embed(String text) {

// if (text == null || text.isBlank()) {
// return new float[3072];
// }

// try {

// float[] result = embeddingModel.embed(text);

// if (result == null || result.length == 0) {
// return new float[3072];
// }

// return result;

// } catch (Exception ex) {
// throw new RuntimeException("Embedding failed", ex);
// }
// }
// }
