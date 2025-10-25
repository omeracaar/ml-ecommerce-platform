package com.omeracar.eshop.exception;

public class ResourceNotFoundException extends BaseException{

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s : '%s'", resourceName, fieldName, fieldValue),
                MessageType.NOT_FOUND);
    }

    public ResourceNotFoundException(String message) {
        super(message, MessageType.NOT_FOUND);
    }
}
