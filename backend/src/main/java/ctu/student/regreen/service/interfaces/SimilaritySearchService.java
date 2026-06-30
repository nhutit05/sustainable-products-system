package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.model.DocumentChunk;

public interface SimilaritySearchService {

    List<DocumentChunk> search(
            float[] embedding,
            int topK
    );

}