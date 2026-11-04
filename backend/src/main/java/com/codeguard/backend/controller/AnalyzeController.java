package com.codeguard.backend.controller;

import com.codeguard.backend.analyzer.AnalysisResult;
import com.codeguard.backend.analyzer.CodeAnalyzer;
import com.codeguard.backend.entity.AnalysisHistory;
import com.codeguard.backend.repository.AnalysisHistoryRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analyze")
public class AnalyzeController {

    private final CodeAnalyzer codeAnalyzer;
    private final AnalysisHistoryRepository historyRepository;

    public AnalyzeController(CodeAnalyzer codeAnalyzer, AnalysisHistoryRepository historyRepository) {
        this.codeAnalyzer = codeAnalyzer;
        this.historyRepository = historyRepository;
    }

    @PostMapping
    public ResponseEntity<AnalysisResult> analyzeCode(
            @RequestBody String code,
            Authentication authentication) {

        AnalysisResult result = codeAnalyzer.analyze(code);

        // Save history in PostgreSQL for the logged-in user
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName())) {
            String username = authentication.getName();

            // Truncate snippet preview if very long
            String snippetPreview = code.length() > 5000 ? code.substring(0, 5000) : code;

            AnalysisHistory history = new AnalysisHistory(
                    username,
                    snippetPreview,
                    result.getScore(),
                    result.getLineCount(),
                    result.getHighCount(),
                    result.getMediumCount(),
                    result.getLowCount(),
                    result.getIssues().size()
            );

            historyRepository.save(history);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<List<AnalysisHistory>> getAnalysisHistory(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String username = authentication.getName();
        List<AnalysisHistory> history = historyRepository.findByUsernameOrderByCreatedAtDesc(username);

        return ResponseEntity.ok(history);
    }
}
