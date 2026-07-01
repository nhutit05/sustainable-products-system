package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;

import ctu.student.regreen.model.DocumentChunk;
import ctu.student.regreen.service.interfaces.HybridSearchService;
import ctu.student.regreen.service.interfaces.SimilaritySearchService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HybridSearchServiceImpl implements HybridSearchService {

    private final SimilaritySearchService similaritySearchService;

    @Override
    public List<DocumentChunk> search(String query, float[] embedding, int topK) {

        List<DocumentChunk> vectorResults = similaritySearchService.search(embedding, topK * 2);

        return rerank(vectorResults, query)
                .stream()
                .limit(topK)
                .toList();
    }

    private List<DocumentChunk> rerank(List<DocumentChunk> chunks, String query) {

        String q = query.toLowerCase();

        return chunks.stream()
                .map(c -> new ScoredChunk(c, score(c, q)))
                .sorted((a, b) -> Double.compare(b.score, a.score))
                .map(sc -> sc.chunk) // 🔥 IMPORTANT FIX
                .toList();
    }

    private double score(DocumentChunk chunk,
            String question) {

        double score = 0;

        String content = chunk.getContent().toLowerCase();

        String q = question.toLowerCase();

        // ------------------------------------------------

        // 1 similarity

        score += 0.60;

        // ------------------------------------------------

        // 2 keyword

        int matched = 0;

        for (String word : q.split("\\s+")) {

            if (word.length() < 3)
                continue;

            if (content.contains(word))
                matched++;
        }

        score += matched * 0.08;

        // ------------------------------------------------

        // 3 exact phrase

        if (content.contains(q))
            score += 0.20;

        // ------------------------------------------------

        // 4 shorter chunk

        if (chunk.getCharacterCount() < 600)
            score += 0.05;

        return score;
    }

    private static class ScoredChunk {
        DocumentChunk chunk;
        double score;

        ScoredChunk(DocumentChunk chunk, double score) {
            this.chunk = chunk;
            this.score = score;
        }
    }
}

// package ctu.student.regreen.service.implement;

// import java.util.List;

// import org.springframework.stereotype.Service;

// import ctu.student.regreen.model.DocumentChunk;
// import ctu.student.regreen.service.interfaces.HybridSearchService;
// import ctu.student.regreen.service.interfaces.SimilaritySearchService;
// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class HybridSearchServiceImpl implements HybridSearchService {

// private final SimilaritySearchService similaritySearchService;

// @Override
// public List<DocumentChunk> search(String query, float[] embedding, int topK)
// {

// List<DocumentChunk> vectorResults =
// similaritySearchService.search(embedding, topK * 2);

// return rerank(vectorResults, query)
// .stream()
// .limit(topK)
// .toList();
// }

// private List<ScoredChunk> rerank(List<DocumentChunk> chunks, String query) {

// String q = query.toLowerCase();

// return chunks.stream()
// .map(c -> new ScoredChunk(c, score(c, q)))
// .sorted((a, b) -> Double.compare(b.score, a.score))
// .toList();
// }

// private double score(DocumentChunk c, String query) {

// if (c.getContent() == null) return 0;

// String content = c.getContent().toLowerCase();

// // keyword match
// double keyword = content.contains(query) ? 0.3 : 0.0;

// // length penalty (optional nhẹ)
// double lengthBonus = c.getCharacterCount() < 500 ? 0.1 : 0.0;

// return keyword + lengthBonus;
// }

// private static class ScoredChunk {
// DocumentChunk chunk;
// double score;

// ScoredChunk(DocumentChunk chunk, double score) {
// this.chunk = chunk;
// this.score = score;
// }
// }
// }