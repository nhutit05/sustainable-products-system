package ctu.student.regreen.integration.payos.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.payos.PayOS;
import vn.payos.model.webhooks.WebhookData;

@Service
@RequiredArgsConstructor
public class PayOSWebhookServiceImpl
        implements PayOSWebhookService {

    private final PayOS payOS;

    @Override
    public void handle(Object webhook) {

        WebhookData data =
                payOS.webhooks().verify(webhook);

        // bước sau sẽ xử lý data
    }
}