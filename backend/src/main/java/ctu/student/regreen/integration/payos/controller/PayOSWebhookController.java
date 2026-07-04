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

        webhookService.handle(webhook);

        return ResponseEntity.ok().build();
    }
}