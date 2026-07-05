package ctu.student.regreen.integration.payos.exception;

public class PayOSException extends RuntimeException {

    public PayOSException(String message) {
        super(message);
    }

    public PayOSException(String message, Throwable cause) {
        super(message, cause);
    }
}