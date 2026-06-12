package ctu.student.regreen.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    USER_NOT_FOUND("USR_001", "User not found"),
    EMAIL_ALREADY_EXISTS("USR_002", "Email already exists"),

    INVALID_REQUEST("COM_001", "Invalid request"),
    INTERNAL_SERVER_ERROR("COM_999", "Internal server error"),

    PAYMENT_STATUS_ALREADY_EXISTS("USR_003", "Payment status already exists"),
    PAYMENT_STATUS_NOT_FOUND("USR_004", "Payment status not found"),

    CITY_NOT_FOUND("USR_005", "City not found");

    private final String code;
    private final String message;
}
