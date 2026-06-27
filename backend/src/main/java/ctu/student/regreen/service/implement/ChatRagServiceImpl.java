package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import ctu.student.regreen.model.ChatMessageMemory;
import ctu.student.regreen.service.interfaces.ChatRagService;
import ctu.student.regreen.service.interfaces.ConversationMemoryService;
import ctu.student.regreen.service.interfaces.RetrieverService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatRagServiceImpl implements ChatRagService {

    private final RetrieverService retrieverService;
    private final ChatClient chatClient;
    private final ConversationMemoryService memoryService;

    // @Override
    // public String ask(String question) {

    // String context = retrieverService.buildContext(question, 5);

    // String prompt = buildPrompt(context);

    // prompt = safe(prompt);

    // return chatClient
    // .prompt()
    // .user(prompt)
    // .call()
    // .content();
    // }

    @Override
    public String ask(String question) {

        String sessionId = "default"; // Phase 9 đơn giản hóa

        // 1. save user message
        memoryService.saveUserMessage(sessionId, question);

        // 2. build context from documents
        String context = retrieverService.buildContext(question, 5);

        // 3. get conversation history
        String history = buildHistory(memoryService.getHistory(sessionId, 6));

        String enrichedQuestion = "[USER QUERY WITH CONTEXT DEPENDENCY]\n" + question;
        // 4. build final prompt
        String prompt = buildPrompt(context, history, enrichedQuestion);

        prompt = safe(prompt);

        // 5. call LLM
        String answer = chatClient
                .prompt()
                .user(prompt)
                .call()
                .content();

        // 6. save assistant message
        memoryService.saveAssistantMessage(sessionId, answer);

        return answer;
    }

    // private String buildPrompt(String context) {

    // return """
    // You are a strict RAG assistant for the ReGreen system.

    // RULES:
    // - Use ONLY the provided context.
    // - If answer is not found in context, say: "I don't know based on the provided
    // documents."
    // - Do NOT use external knowledge.
    // - Be concise and factual.

    // CONTEXT:
    // %s

    // INSTRUCTION:
    // - Extract the most relevant information.
    // - If multiple chunks are relevant, combine them logically.
    // - Do not hallucinate.

    // FINAL ANSWER:
    // """.formatted(context);
    // }

    private String buildPrompt(String context, String history, String question) {

        return """
                You are a STRICT RAG assistant for ReGreen.

                HARD RULES:
                1. Use conversation memory to resolve references (it, this, that, they, them).
                2. LAST_ASSISTANT_CONTEXT is the most important prior answer.
                3. Use DOCUMENT CONTEXT ONLY for factual grounding.
                4. If information is not in documents → say:
                   "I don't know based on the provided documents."
                5. NEVER hallucinate.

                -------------------------
                CONVERSATION MEMORY (VERY IMPORTANT):
                %s

                -------------------------
                DOCUMENT CONTEXT:
                %s

                -------------------------
                CURRENT QUESTION:
                %s

                -------------------------
                INSTRUCTION FLOW:
                Step 1: Check LAST_ASSISTANT_CONTEXT
                Step 2: Check CONVERSATION MEMORY
                Step 3: Check DOCUMENT CONTEXT
                Step 4: Answer

                FINAL ANSWER:
                """.formatted(history, context, question);
    }

    private String safe(String text) {
        if (text == null)
            return "";

        return text
                .replaceAll("[\\p{Cntrl}&&[^\r\n\t]]", "")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private String buildHistory(List<ChatMessageMemory> history) {

        if (history == null || history.isEmpty()) {
            return "NO_HISTORY";
        }

        StringBuilder sb = new StringBuilder();

        sb.append("=== CONVERSATION MEMORY START ===\n");

        ChatMessageMemory lastAssistant = null;

        for (ChatMessageMemory m : history) {

            String role = m.getRole().equals("user")
                    ? "User"
                    : "Assistant";

            sb.append(role)
                    .append(": ")
                    .append(m.getContent())
                    .append("\n");

            if (m.getRole().equals("assistant")) {
                lastAssistant = m;
            }
        }

        // 🔥 ADD MEMORY ANCHOR (QUAN TRỌNG)
        if (lastAssistant != null) {
            sb.append("\nLAST_ASSISTANT_CONTEXT:\n")
                    .append(lastAssistant.getContent())
                    .append("\n");
        }

        sb.append("=== CONVERSATION MEMORY END ===");

        return sb.toString();
    }
}