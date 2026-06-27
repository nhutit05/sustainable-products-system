package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;

import ctu.student.regreen.model.DocumentChunk;
import ctu.student.regreen.service.interfaces.ChunkFilterService;
import ctu.student.regreen.service.interfaces.EmbeddingService;
import ctu.student.regreen.service.interfaces.HybridSearchService;
import ctu.student.regreen.service.interfaces.RetrieverService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RetrieverServiceImpl implements RetrieverService {

    private final EmbeddingService embeddingService;
    private final HybridSearchService hybridSearchService;
    private final ChunkFilterService chunkFilterService;

    @Override
    public List<DocumentChunk> retrieve(String question, int topK) {

        if (question == null || question.isBlank()) {
            return List.of();
        }

        float[] embedding = embeddingService.embed(question);

        if (embedding == null || embedding.length == 0) {
            return List.of();
        }

        List<DocumentChunk> chunks = hybridSearchService.search(question, embedding, topK);

        chunks = chunkFilterService.filter(chunks);

        if (chunks == null || chunks.isEmpty())
            return List.of();

        if (chunks.size() > topK) {
            return chunks.subList(0, topK);
        }

        return chunks;
    }

    @Override
    public String buildContext(String question, int topK) {

        List<DocumentChunk> chunks = retrieve(question, topK);

        StringBuilder context = new StringBuilder();

        context.append("=== DOCUMENT CONTEXT START ===\n\n");

        if (chunks.isEmpty()) {
            context.append("NO_RELEVANT_CONTEXT_FOUND\n");
        } else {

            for (int i = 0; i < chunks.size(); i++) {

                DocumentChunk chunk = chunks.get(i);

                if (chunk == null || chunk.getContent() == null)
                    continue;

                context.append("[SOURCE ")
                        .append(i + 1)
                        .append("]\n")
                        .append(clean(chunk.getContent().trim()))
                        .append("\n\n---\n\n");
            }
        }

        context.append("QUESTION:\n")
                .append(question)
                .append("\n\n=== END CONTEXT ===");

        return context.toString();
    }

    private String clean(String text) {
        if (text == null)
            return "";

        return text
                .replaceAll("[\\p{Cntrl}&&[^\r\n\t]]", "")
                .replaceAll("\\s+", " ")
                .trim();
    }
}

// package ctu.student.regreen.service.implement;

// import java.util.List;

// import org.springframework.stereotype.Service;

// import ctu.student.regreen.model.DocumentChunk;
// import ctu.student.regreen.service.interfaces.ChunkFilterService;
// import ctu.student.regreen.service.interfaces.EmbeddingService;
// import ctu.student.regreen.service.interfaces.HybridSearchService;
// import ctu.student.regreen.service.interfaces.RetrieverService;
// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class RetrieverServiceImpl implements RetrieverService {

// private final EmbeddingService embeddingService;
// private final HybridSearchService hybridSearchService;
// private final ChunkFilterService chunkFilterService;

// @Override
// public List<DocumentChunk> retrieve(String question, int topK) {

// if (question == null || question.isBlank()) {
// return List.of();
// }

// float[] embedding = embeddingService.embed(question);

// if (embedding == null || embedding.length == 0) {
// return List.of();
// }

// List<DocumentChunk> chunks = hybridSearchService.search(
// question,
// embedding,
// topK * 2);

// if (chunks == null || chunks.isEmpty()) {
// return List.of();
// }

// chunks = chunkFilterService.filter(chunks);

// if (chunks == null || chunks.isEmpty()) {
// return List.of();
// }

// if (chunks.size() > topK) {
// return chunks.subList(0, topK);
// }

// return chunks;
// }

// @Override
// public String buildContext(String question, int topK) {

// List<DocumentChunk> chunks = retrieve(question, topK);

// StringBuilder context = new StringBuilder();

// context.append("CONTEXT:\n\n");

// if (chunks.isEmpty()) {
// context.append("[NO_CONTEXT_FOUND]\n\n");
// } else {

// for (int i = 0; i < chunks.size(); i++) {

// DocumentChunk chunk = chunks.get(i);

// if (chunk == null || chunk.getContent() == null) {
// continue;
// }

// context.append("[Chunk ")
// .append(i + 1)
// .append("]\n")
// .append(clean(chunk.getContent()))
// .append("\n\n");
// }
// }

// context.append("QUESTION:\n")
// .append(question);

// return context.toString();
// }

// private String clean(String text) {

// if (text == null)
// return "";

// return text
// .replaceAll("[\\p{Cntrl}&&[^\r\n\t]]", "")
// .replaceAll("[^\\p{Print}\n\t]", "")
// .trim();
// }
// }