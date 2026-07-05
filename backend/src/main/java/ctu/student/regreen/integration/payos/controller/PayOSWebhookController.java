package ctu.student.regreen.integration.payos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ctu.student.regreen.integration.payos.service.PayOSWebhookService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payos")
@RequiredArgsConstructor
public class PayOSWebhookController {

    private final PayOSWebhookService webhookService;

    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(
            @RequestBody Object webhook) {
        
        System.out.println("========== WEBHOOK RECEIVED ==========");

        webhookService.handle(webhook);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/webhook/confirm")
    public ResponseEntity<String> confirmWebhook() {

        String webhookUrl = "https://encounter-trustee-contest.ngrok-free.dev/api/payos/webhook";

        webhookService.confirm(webhookUrl);

        return ResponseEntity.ok("Webhook confirmed.");
    }
}