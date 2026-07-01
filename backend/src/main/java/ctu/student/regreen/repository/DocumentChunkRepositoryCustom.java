package ctu.student.regreen.repository;

import java.util.List;

import ctu.student.regreen.model.DocumentChunk;

public interface DocumentChunkRepositoryCustom {

    List<DocumentChunk> findTopKSimilar(
            float[] embedding,
            int topK
    );

}