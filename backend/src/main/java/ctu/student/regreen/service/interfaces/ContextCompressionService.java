package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.model.DocumentChunk;

public interface ContextCompressionService {

    List<DocumentChunk> compress(
            List<DocumentChunk> chunks,
            String question);

}