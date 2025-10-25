package com.omeracar.eshop.exception;

import com.omeracar.eshop.controller.RootEntity;
import com.omeracar.eshop.dto.exception.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<RootEntity<Object>> handleBaseException(BaseException ex, HttpServletRequest request) {
        HttpStatus status = determineHttpStatus(ex.getMessageType());
        RootEntity<Object> errorBody = RootEntity.error(ex.getErrorMessage(), ex.getMessageType(), status);

        return new ResponseEntity<>(errorBody, status);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RootEntity<Object>> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        String detailedErrorMessage = "Validation failed: " + errors.toString();

        HttpStatus status = HttpStatus.BAD_REQUEST; // 400
        RootEntity<Object> errorBody = RootEntity.error(detailedErrorMessage, MessageType.VALIDATION_ERROR, status);

        return new ResponseEntity<>(errorBody, status);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<RootEntity<Object>> handleGenericException(Exception ex, HttpServletRequest request) {

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR; // 500
        String errorMessage = "Beklenmedik bir sunucu hatası oluştu. Lütfen tekrar deneyin."; // Kullanıcı dostu mesaj
        RootEntity<Object> errorBody = RootEntity.error(errorMessage, MessageType.ERROR, status);

        return new ResponseEntity<>(errorBody, status);
    }

    private HttpStatus determineHttpStatus(MessageType messageType) {
        return switch (messageType) {
            case NOT_FOUND -> HttpStatus.NOT_FOUND; // 404
            case VALIDATION_ERROR -> HttpStatus.BAD_REQUEST; // 400
            case UNAUTHORIZED -> HttpStatus.UNAUTHORIZED; // 401
            case FORBIDDEN -> HttpStatus.FORBIDDEN; // 403
            case ERROR -> HttpStatus.INTERNAL_SERVER_ERROR; // 500
            default -> HttpStatus.INTERNAL_SERVER_ERROR; // Diğerleri için varsayılan 500
        };
    }
}

