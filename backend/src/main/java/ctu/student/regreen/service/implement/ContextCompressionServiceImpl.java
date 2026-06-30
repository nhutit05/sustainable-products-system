package ctu.student.regreen.service.implement;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import ctu.student.regreen.model.DocumentChunk;
import ctu.student.regreen.service.interfaces.ContextCompressionService;

@Service
public class ContextCompressionServiceImpl
        implements ContextCompressionService {

    @Override
    public List<DocumentChunk> compress(
            List<DocumentChunk> chunks,
            String question) {

        if (chunks == null || chunks.isEmpty()) {
            return List.of();
        }

        String[] keywords = normalize(question).split("\\s+");

        List<DocumentChunk> result = new ArrayList<>();

        for (DocumentChunk chunk : chunks) {

            if (chunk.getContent() == null) {
                continue;
            }

            String compressed = compressText(
                    chunk.getContent(),
                    keywords);

            System.out.println("Before = " + chunk.getContent().length());

            System.out.println("After = " + compressed.length());

            chunk.setContent(compressed);

            result.add(chunk);
        }

        return result;
    }

    private String compressText(
            String text,
            String[] keywords) {

        String[] lines = text.split("\\R");

        List<ScoredLine> scored = new ArrayList<>();

        for (String line : lines) {

            String normalized = normalize(line);

            if (normalized.isBlank()) {
                continue;
            }

            int score = 0;

            for (String keyword : keywords) {

                if (keyword.isBlank()) {
                    continue;
                }

                if (normalized.contains(keyword)) {
                    score++;
                }
            }

            if (score > 0) {
                scored.add(
                        new ScoredLine(
                                line.trim(),
                                score));
            }
        }

        if (scored.isEmpty()) {

            return text.length() <= 500
                    ? text
                    : text.substring(0, 500);
        }

        scored.sort((a, b) -> Integer.compare(b.score, a.score));

        StringBuilder sb = new StringBuilder();

        int count = Math.min(5, scored.size());

        for (int i = 0; i < count; i++) {

            sb.append(scored.get(i).text)
                    .append("\n");
        }

        return sb.toString().trim();
    }

    private String normalize(String text) {

        if (text == null) {
            return "";
        }

        return text.toLowerCase();
    }

    private static class ScoredLine {

        String text;

        int score;

        ScoredLine(String text, int score) {

            this.text = text;

            this.score = score;
        }
    }
}
