package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;

import ctu.student.regreen.model.DocumentChunk;
import ctu.student.regreen.service.interfaces.ChunkFilterService;

@Service
public class ChunkFilterServiceImpl
                implements ChunkFilterService {

        @Override
        public List<DocumentChunk> filter(List<DocumentChunk> chunks) {

                if (chunks == null || chunks.isEmpty()) {
                        return List.of();
                }

                // lấy similarity cao nhất
                double bestScore = chunks.stream()
                                .map(DocumentChunk::getSimilarityScore)
                                .filter(java.util.Objects::nonNull)
                                .max(Double::compareTo)
                                .orElse(0.0);

                // thấp hơn best 0.08 thì loại
                double threshold = Math.max(bestScore - 0.12, 0.50);

                // System.out.println("Best Similarity = " + bestScore);
                // System.out.println("Adaptive Threshold = " + threshold);

                return chunks.stream()

                                .filter(c -> c.getSimilarityScore() == null
                                                || c.getSimilarityScore() >= threshold)

                                .filter(c -> c.getContent() != null
                                                && !c.getContent().isBlank())

                                .filter(c -> c.getCharacterCount() >= 100)

                                .distinct()

                                .toList();
        }
}