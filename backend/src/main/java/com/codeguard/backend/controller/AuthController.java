package com.codeguard.backend.controller;

import com.codeguard.backend.dto.AuthResponse;
import com.codeguard.backend.dto.LoginRequest;
import com.codeguard.backend.dto.UserResponse;
import com.codeguard.backend.entity.User;
import com.codeguard.backend.service.JwtService;
import com.codeguard.backend.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody User user) {

        User savedUser = userService.createUser(user);

        UserResponse response = new UserResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userService
                .getUserByUsername(request.getUsername())
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        boolean passwordMatches =
                userService.checkPassword(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid password");
        }

        // Generate JWT token after successful login
        String token = jwtService.generateToken(user.getUsername());

        AuthResponse response = new AuthResponse(
                "Login successful",
                user.getUsername(),
                token
        );

        return ResponseEntity.ok(response);
    }
}