package com.omeracar.eshop.dto.exception;

import com.omeracar.eshop.exception.MessageType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {
    private LocalDateTime timestamp;
    private MessageType messageType;
    private String errorMessage;
    private String path;
}
