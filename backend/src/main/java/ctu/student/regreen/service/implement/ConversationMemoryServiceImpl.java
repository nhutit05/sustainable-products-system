package ctu.student.regreen.service.implement;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import ctu.student.regreen.model.ChatMessageMemory;
import ctu.student.regreen.service.interfaces.ConversationMemoryService;

@Service
public class ConversationMemoryServiceImpl implements ConversationMemoryService {

    private final Map<String, List<ChatMessageMemory>> store = new HashMap<>();

    @Override
    public void saveUserMessage(String sessionId, String message) {
        store.computeIfAbsent(sessionId, k -> new ArrayList<>())
                .add(ChatMessageMemory.builder()
                        .role("user")
                        .content(message)
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @Override
    public void saveAssistantMessage(String sessionId, String message) {
        store.computeIfAbsent(sessionId, k -> new ArrayList<>())
                .add(ChatMessageMemory.builder()
                        .role("assistant")
                        .content(message)
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    @Override
    public List<ChatMessageMemory> getHistory(String sessionId, int limit) {

        List<ChatMessageMemory> history =
                store.getOrDefault(sessionId, new ArrayList<>());

        return history.stream()
                .skip(Math.max(0, history.size() - limit))
                .toList();
    }

    @Override
    public void clear(String sessionId) {
        store.remove(sessionId);
    }
}
