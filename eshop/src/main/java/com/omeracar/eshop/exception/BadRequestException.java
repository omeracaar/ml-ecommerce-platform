package com.omeracar.eshop.exception;

public class BadRequestException extends BaseException{

    public BadRequestException(String message) {
        super(message, MessageType.VALIDATION_ERROR);
    }

    public BadRequestException(String message, MessageType type) {
        super(message, type);
    }
}
