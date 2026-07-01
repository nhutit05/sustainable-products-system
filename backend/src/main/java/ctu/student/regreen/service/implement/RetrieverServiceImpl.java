package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;

import ctu.student.regreen.model.DocumentChunk;
import ctu.student.regreen.service.interfaces.ChunkFilterService;
import ctu.student.regreen.service.interfaces.ContextCompressionService;
import ctu.student.regreen.service.interfaces.EmbeddingService;
import ctu.student.regreen.service.interfaces.HybridSearchService;
import ctu.student.regreen.service.interfaces.RetrieverService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;

@Service
@RequiredArgsConstructor
public class RetrieverServiceImpl implements RetrieverService {

    private final EmbeddingService embeddingService;
    private final HybridSearchService hybridSearchService;
    private final ChunkFilterService chunkFilterService;
    private final ContextCompressionService contextCompressionService;

    @Override
    @Cacheable(value = "retrievals", key = "#question == null ? '' : #question.trim().toLowerCase().concat('-').concat(#topK)")
    public List<DocumentChunk> retrieve(String question, int topK) {

        System.out.println("CALL RETRIEVER");

        if (question == null || question.isBlank()) {
            return List.of();
        }

        float[] embedding = embeddingService.embed(question);

        if (embedding == null || embedding.length == 0) {
            return List.of();
        }

        List<DocumentChunk> chunks = hybridSearchService.search(question, embedding, topK);

        chunks = chunkFilterService.filter(chunks);
        chunks = contextCompressionService.compress(chunks, question);

        System.out.println("Chunks after filter = " + chunks.size());

        if (chunks == null || chunks.isEmpty())
            return List.of();

        if (chunks.size() > topK) {
            return chunks.subList(0, topK);
        }

        return chunks;
    }

    @Override
    @Cacheable(value = "rag-context", key = "#question.trim().toLowerCase() + '_' + #topK")
    public String buildContext(String question, int topK) {

        System.out.println("BUILD CONTEXT");

        question = normalize(question);

        List<DocumentChunk> chunks = retrieve(question, topK);

        StringBuilder context = new StringBuilder();

        context.append("=== DOCUMENT CONTEXT ===\n\n");

        if (chunks.isEmpty()) {
            context.append("NO_CONTEXT_FOUND\n");
        } else {

            for (int i = 0; i < chunks.size(); i++) {

                DocumentChunk c = chunks.get(i);

                context.append("[SOURCE ")
                        .append(i + 1)
                        .append("]\n");

                context.append("CONTENT: ")
                        .append(clean(c.getContent()))
                        .append("\n\n");
            }
        }

        context.append("QUESTION:\n")
                .append(question);

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

    private String normalize(String text) {

        if (text == null) {
            return "";
        }

        return text

                .trim()

                .toLowerCase()

                .replaceAll("[^\\p{L}\\p{N}\\s]", "")

                .replaceAll("\\s+", " ");
    }
}

// @Override
// public String buildContext(String question, int topK) {

// List<DocumentChunk> chunks = retrieve(question, topK);

// StringBuilder context = new StringBuilder();

// context.append("=== DOCUMENT CONTEXT START ===\n\n");

// if (chunks.isEmpty()) {
// context.append("NO_RELEVANT_CONTEXT_FOUND\n");
// } else {

// for (int i = 0; i < chunks.size(); i++) {

// DocumentChunk chunk = chunks.get(i);

// if (chunk == null || chunk.getContent() == null)
// continue;

// context.append("[SOURCE ")
// .append(i + 1)
// .append("]\n")
// .append(clean(chunk.getContent().trim()))
// .append("\n\n---\n\n");
// }
// }

// context.append("QUESTION:\n")
// .append(question)
// .append("\n\n=== END CONTEXT ===");

// return context.toString();
// }
