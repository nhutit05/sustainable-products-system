package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import ctu.student.regreen.model.ChatMessageMemory;
import ctu.student.regreen.service.interfaces.QueryRewriteService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QueryRewriteServiceImpl implements QueryRewriteService {

    private final ChatClient chatClient;

    @Override
    @Cacheable(value = "rewrite-query", key = "#question.trim().toLowerCase()")
    public String rewrite(
            String question,
            List<ChatMessageMemory> history) {

        if (history == null || history.isEmpty()) {
            return question;
        }

        if (!shouldRewrite(question)) {
            return question;
        }

        String prompt = buildPrompt(question, history);

        try {

            String rewritten = chatClient
                    .prompt()
                    .user(prompt)
                    .call()
                    .content();

            if (rewritten == null || rewritten.isBlank()) {
                return question;
            }

            return rewritten.trim();

        } catch (Exception ex) {

            return question;

        }
    }

    private String buildPrompt(
            String question,
            List<ChatMessageMemory> history) {

        StringBuilder sb = new StringBuilder();

        for (ChatMessageMemory m : history) {

            sb.append(m.getRole())
                    .append(": ")
                    .append(m.getContent())
                    .append("\n");
        }

        return """
                You are a query rewriting assistant.

                Your job is ONLY to rewrite the current user question
                so that it becomes self-contained for semantic search.

                Rules:
                - NEVER answer the question.
                - Keep original meaning.
                - Resolve pronouns like:
                  it, this, that, he, she, they...
                - Return ONLY one rewritten sentence.
                - If rewriting is unnecessary,
                  return the original question.

                Conversation:

                %s

                Current question:

                %s
                """
                .formatted(sb, question);
    }

    private boolean shouldRewrite(String question) {

        if (question == null) {
            return false;
        }

        String q = question.trim().toLowerCase();

        String[] ambiguous = {
                "nó",
                "cái đó",
                "đó",
                "vậy",
                "thế",
                "bao lâu",
                "bao nhiêu",
                "còn",
                "tiếp",
                "ở trên",
                "ý đó",
                "cái này",
                "điều đó"
        };

        for (String s : ambiguous) {

            if (q.startsWith(s)) {
                return true;
            }
        }

        return false;
    }

}