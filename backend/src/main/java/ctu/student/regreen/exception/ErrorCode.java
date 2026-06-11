package ctu.student.regreen.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    USER_NOT_FOUND("USR_001", "User not found"),
    EMAIL_ALREADY_EXISTS("USR_002", "Email already exists"),

    INVALID_REQUEST("COM_001", "Invalid request"),
    INTERNAL_SERVER_ERROR("COM_999", "Internal server error");

    private final String code;
    private final String message;
}
