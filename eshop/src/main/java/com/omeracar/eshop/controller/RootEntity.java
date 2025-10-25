package com.omeracar.eshop.controller;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.omeracar.eshop.exception.MessageType;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RootEntity<T> {

    private final LocalDateTime timestamp = LocalDateTime.now();
    private Integer status;
    private MessageType messageType; // SUCCESS, ERROR, NOT_FOUND vb
    private T payload;
    private String errorMessage;


    private RootEntity() {}


    public static <T> RootEntity<T> ok(T payload) {
        RootEntity<T> rootEntity = new RootEntity<>();
        rootEntity.setStatus(HttpStatus.OK.value()); // 200
        rootEntity.setMessageType(MessageType.SUCCESS);
        rootEntity.setPayload(payload);
        return rootEntity;
    }

    public static <T> RootEntity<T> created(T payload) {
        RootEntity<T> rootEntity = new RootEntity<>();
        rootEntity.setStatus(HttpStatus.CREATED.value()); // 201
        rootEntity.setMessageType(MessageType.SUCCESS);
        rootEntity.setPayload(payload);
        return rootEntity;
    }

    public static <Void> RootEntity<Void> noContent() {
        RootEntity<Void> rootEntity = new RootEntity<>();
        rootEntity.setStatus(HttpStatus.NO_CONTENT.value()); // 204
        rootEntity.setMessageType(MessageType.SUCCESS);
        // Payload ve error null kalacak
        return rootEntity;
    }



    public static <T> RootEntity<T> error(String errorMessage, MessageType messageType, HttpStatus status) {
        RootEntity<T> rootEntity = new RootEntity<>();
        rootEntity.setStatus(status.value());
        rootEntity.setMessageType(messageType);
        rootEntity.setErrorMessage(errorMessage);
        // Payload null kalacak
        return rootEntity;
    }

    public static <T> RootEntity<T> notFound(String errorMessage) {
        return error(errorMessage, MessageType.NOT_FOUND, HttpStatus.NOT_FOUND); // 404
    }

    public static <T> RootEntity<T> badRequest(String errorMessage) {
        return error(errorMessage, MessageType.VALIDATION_ERROR, HttpStatus.BAD_REQUEST); // 400
    }

    public static <T> RootEntity<T> internalServerError(String errorMessage) {
        return error(errorMessage, MessageType.ERROR, HttpStatus.INTERNAL_SERVER_ERROR); // 500
    }

}
