package com.codeguard.backend.dto;

public class AuthResponse {

    private String message;
    private String username;
    private String token;

    public AuthResponse(String message, String username, String token) {
        this.message = message;
        this.username = username;
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public String getUsername() {
        return username;
    }

    public String getToken() {
        return token;
    }
}