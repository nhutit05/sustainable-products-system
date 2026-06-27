package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.ChatRequest;
import ctu.student.regreen.dto.response.ChatResponse;

public interface ChatService {

    ChatResponse ask(ChatRequest request);

}