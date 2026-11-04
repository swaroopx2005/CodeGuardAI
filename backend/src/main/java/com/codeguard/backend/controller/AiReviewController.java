package com.codeguard.backend.controller;

import com.codeguard.backend.dto.AiReviewResponse;
import com.codeguard.backend.service.AiReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiReviewController {

    private final AiReviewService aiReviewService;

    public AiReviewController(AiReviewService aiReviewService) {
        this.aiReviewService = aiReviewService;
    }

    @PostMapping("/review")
    public ResponseEntity<AiReviewResponse> getAiReview(@RequestBody String code) {

        AiReviewResponse response = aiReviewService.generateReview(code);
        return ResponseEntity.ok(response);
    }
}
