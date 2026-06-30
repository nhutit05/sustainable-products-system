package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.model.DocumentChunk;

public interface HybridSearchService {

    List<DocumentChunk> search(String query, float[] embedding, int topK);
}