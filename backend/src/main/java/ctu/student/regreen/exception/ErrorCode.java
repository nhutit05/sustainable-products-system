package ctu.student.regreen.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    USER_NOT_FOUND("USR_001", "User not found"),
    EMAIL_ALREADY_EXISTS("USR_002", "Email already exists"),
    PASSWORD_INCORRECT("USR_003", "Password is incorrect"),
    USERNAME_ALREADY_EXISTS("USR_004", "Username already exists"),

    INVALID_REQUEST("COM_001", "Invalid request"),
    INTERNAL_SERVER_ERROR("COM_999", "Internal server error"),

    PAYMENT_STATUS_ALREADY_EXISTS("USR_003", "Payment status already exists"),
    PAYMENT_STATUS_NOT_FOUND("USR_004", "Payment status not found"),


    CITY_NOT_FOUND("USR_005", "City not found"),
    VILLAGE_NOT_FOUND("USR_006", "Village not found"),
    FILE_NOT_FOUND("USR_007", "File not found"),
    FILE_ALREADY_EXISTS("USR_008", "File already exists"),

    IMAGE_UPLOAD_FAILED("USR_009", "Image upload failed"),

    ACCOUNT_LOCKED("USR_010", "Tài khoản đã bị khoá");

    private final String code;
    private final String message;
}
