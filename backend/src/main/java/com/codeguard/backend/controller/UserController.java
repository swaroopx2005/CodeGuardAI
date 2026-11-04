package com.codeguard.backend.controller;

import com.codeguard.backend.dto.UserResponse;
import com.codeguard.backend.entity.User;
import com.codeguard.backend.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {

        String username = authentication.getName();

        Optional<User> user =
                userService.getUserByUsername(username);

        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User currentUser = user.get();

        UserResponse response = new UserResponse(
                currentUser.getId(),
                currentUser.getUsername(),
                currentUser.getEmail()
        );

        return ResponseEntity.ok(response);
    }
}