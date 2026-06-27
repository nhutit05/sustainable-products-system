package ctu.student.regreen.service.interfaces;

import java.util.List;
import ctu.student.regreen.model.ChatMessageMemory;

public interface ConversationMemoryService {

    void saveUserMessage(String sessionId, String message);

    void saveAssistantMessage(String sessionId, String message);

    List<ChatMessageMemory> getHistory(String sessionId, int limit);

    void clear(String sessionId);
}