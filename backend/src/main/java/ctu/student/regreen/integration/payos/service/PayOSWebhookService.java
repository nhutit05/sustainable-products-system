package ctu.student.regreen.integration.payos.service;

public interface PayOSWebhookService {

    void handle(Object webhook);

}