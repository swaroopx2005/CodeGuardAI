package com.codeguard.backend.controller;

import com.codeguard.backend.dto.OptimizationRequest;
import com.codeguard.backend.dto.OptimizationResponse;
import com.codeguard.backend.entity.OptimizationHistory;
import com.codeguard.backend.repository.OptimizationHistoryRepository;
import com.codeguard.backend.service.CodeOptimizationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai/optimize")
public class AiOptimizationController {

    private final CodeOptimizationService optimizationService;
    private final OptimizationHistoryRepository historyRepository;

    public AiOptimizationController(CodeOptimizationService optimizationService,
                                    OptimizationHistoryRepository historyRepository) {
        this.optimizationService = optimizationService;
        this.historyRepository = historyRepository;
    }

    @PostMapping
    public ResponseEntity<OptimizationResponse> optimizeCode(@RequestBody OptimizationRequest request) {
        OptimizationResponse response = optimizationService.optimizeCode(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveOptimizationHistory(
            @RequestBody OptimizationHistory history,
            Authentication authentication) {

        String username = "anonymous";
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName())) {
            username = authentication.getName();
        }

        history.setUsername(username);
        OptimizationHistory saved = historyRepository.save(history);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/history")
    public ResponseEntity<List<OptimizationHistory>> getHistory(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String username = authentication.getName();
        List<OptimizationHistory> list = historyRepository.findByUsernameOrderByCreatedAtDesc(username);
        return ResponseEntity.ok(list);
    }
}
