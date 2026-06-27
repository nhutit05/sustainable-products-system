package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.model.DocumentChunk;

public interface ChunkFilterService {

    List<DocumentChunk> filter(List<DocumentChunk> chunks);

}