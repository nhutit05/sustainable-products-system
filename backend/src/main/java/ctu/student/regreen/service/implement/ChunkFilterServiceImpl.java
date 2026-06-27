package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;

import ctu.student.regreen.model.DocumentChunk;
import ctu.student.regreen.service.interfaces.ChunkFilterService;

@Service
public class ChunkFilterServiceImpl
        implements ChunkFilterService {

    @Override
    public List<DocumentChunk> filter(
            List<DocumentChunk> chunks
    ) {

        return chunks.stream()

                // bỏ chunk rỗng
                .filter(c ->
                        c.getContent() != null
                                && !c.getContent().isBlank())

                // bỏ chunk quá ngắn
                .filter(c ->
                        c.getCharacterCount() >= 100)

                // bỏ duplicate
                .distinct()

                .toList();
    }

}