package com.omeracar.eshop.controller;

import org.springframework.http.ResponseEntity;

public abstract class RestBaseController {


    public <T> ResponseEntity<RootEntity<T>> ok(T payload) {
        RootEntity<T> body = RootEntity.ok(payload);
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    public <T> ResponseEntity<RootEntity<T>> created(T payload) {
        RootEntity<T> body = RootEntity.created(payload);
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    public <T> ResponseEntity<RootEntity<Void>> noContent() {
        RootEntity<Void> body = RootEntity.noContent();
        return ResponseEntity.status(body.getStatus()).build();
    }

}
