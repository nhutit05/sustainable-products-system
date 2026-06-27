package ctu.student.regreen.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ctu.student.regreen.dto.request.ChatRequest;
import ctu.student.regreen.dto.response.ChatResponse;
import ctu.student.regreen.service.interfaces.ChatRagService;
import ctu.student.regreen.service.interfaces.ChatService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final ChatRagService chatRagService;

    @PostMapping("/test")
    public ResponseEntity<ChatResponse> test(
            @RequestBody ChatRequest request) {

        return ResponseEntity.ok(
                chatService.ask(request));
    }

    @GetMapping
    public String chat(@RequestParam String q) {
        return chatRagService.ask(q);
    }

    @GetMapping("/rag")
    public String rag(@RequestParam String q) {
        return chatRagService.ask(q);
    }

    @GetMapping("/rag-memory")
    public String ragMemory(@RequestParam String q) {
        return chatRagService.ask(q);
    }
}