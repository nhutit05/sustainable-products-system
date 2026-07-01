package ctu.student.regreen.service.implement;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import ctu.student.regreen.dto.request.ChatRequest;
import ctu.student.regreen.dto.response.ChatResponse;
import ctu.student.regreen.service.interfaces.ChatService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl
        implements ChatService {

    private final ChatClient chatClient;

    // @Override
    // public ChatResponse ask(ChatRequest request) {

    //     String answer = chatClient
    //             .prompt(request.getMessage())
    //             .call()
    //             .content();

    //     return ChatResponse.builder()
    //             .answer(answer)
    //             .build();
    // }

    @Override
public ChatResponse ask(ChatRequest request) {

    try {

        String answer = chatClient
                .prompt(request.getMessage())
                .call()
                .content();

        return ChatResponse.builder()
                .answer(answer)
                .build();

    } catch (Exception e) {

        e.printStackTrace();

        throw new RuntimeException(
                "Gemini Error: " + e.getMessage(),
                e
        );
    }
}
}