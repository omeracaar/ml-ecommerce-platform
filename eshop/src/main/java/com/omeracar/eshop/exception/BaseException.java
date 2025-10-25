package com.omeracar.eshop.exception;

import lombok.Getter;

@Getter
public class BaseException extends RuntimeException {

    private final MessageType messageType;
    private final String errorMessage;

    public BaseException(String errorMessage) {
        super(errorMessage);
        this.errorMessage = errorMessage;
        this.messageType = MessageType.ERROR;
    }

    public BaseException(String errorMessage, MessageType messageType) {
        super(errorMessage);
        this.errorMessage = errorMessage;
        this.messageType = messageType;
    }

    public BaseException(String errorMessage, MessageType messageType, Throwable cause) {
        super(errorMessage, cause);
        this.errorMessage = errorMessage;
        this.messageType = messageType;
    }

}
