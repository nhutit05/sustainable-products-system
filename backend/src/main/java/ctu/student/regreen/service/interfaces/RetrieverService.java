package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.model.DocumentChunk;

public interface RetrieverService {

    String buildContext(String question, int topK);

    List<DocumentChunk> retrieve(String question, int topK);
}