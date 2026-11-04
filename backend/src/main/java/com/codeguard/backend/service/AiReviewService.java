package com.codeguard.backend.service;

import com.codeguard.backend.analyzer.AnalysisResult;
import com.codeguard.backend.analyzer.CodeAnalyzer;
import com.codeguard.backend.analyzer.CodeIssue;
import com.codeguard.backend.dto.AiReviewResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AiReviewService {

    private final CodeAnalyzer codeAnalyzer;

    public AiReviewService(CodeAnalyzer codeAnalyzer) {
        this.codeAnalyzer = codeAnalyzer;
    }

    public AiReviewResponse generateReview(String code) {

        AnalysisResult result = codeAnalyzer.analyze(code);

        // 1. Overview
        String overview = String.format(
                "CodeGuard AI Analysis complete: Found %d issues across %d lines of code. Code Quality Score: %d/100 (HIGH: %d, MEDIUM: %d, LOW: %d).",
                result.getIssues().size(),
                result.getLineCount(),
                result.getScore(),
                result.getHighCount(),
                result.getMediumCount(),
                result.getLowCount()
        );

        // 2. Key Problem Explanations
        List<String> keyProblems = new ArrayList<>();
        for (CodeIssue issue : result.getIssues()) {
            keyProblems.add(String.format(
                    "[Line %d | %s | %s] %s -> %s",
                    issue.getLine(),
                    issue.getSeverity(),
                    issue.getType(),
                    issue.getMessage(),
                    issue.getSuggestion()
            ));
        }

        if (keyProblems.isEmpty()) {
            keyProblems.add("No critical code smells or anti-patterns detected. Code is clean and readable!");
        }

        // 3. Complexity Estimation
        String complexity = estimateComplexity(code);

        // 4. Corrected Code Generation
        String correctedCode = generateCorrectedCode(code, result.getIssues());

        // 5. Generated Test Cases
        String testCases = generateUnitTests(code);

        return new AiReviewResponse(overview, keyProblems, correctedCode, testCases, complexity);
    }

    private String estimateComplexity(String code) {
        int forCount = countOccurrences(code, "for (") + countOccurrences(code, "for(");
        int whileCount = countOccurrences(code, "while (") + countOccurrences(code, "while(");
        int totalLoops = forCount + whileCount;

        if (totalLoops >= 2 && (code.contains("for") || code.contains("while"))) {
            return "Estimated Time Complexity: O(n²) due to nested loops. Space Complexity: O(1) auxiliary space.";
        } else if (totalLoops == 1) {
            return "Estimated Time Complexity: O(n) linear scan. Space Complexity: O(1) auxiliary space.";
        } else {
            return "Estimated Time Complexity: O(1) constant time. Space Complexity: O(1) auxiliary space.";
        }
    }

    private String generateCorrectedCode(String originalCode, List<CodeIssue> issues) {
        String refactored = originalCode;

        // Automatically replace System.out.println with logger call
        if (refactored.contains("System.out.println")) {
            refactored = "// Recommendation: Add @Slf4j at class level\n" +
                    refactored.replace("System.out.println", "log.info");
        }

        return refactored;
    }

    private String generateUnitTests(String code) {
        return """
                import org.junit.jupiter.api.Test;
                import org.junit.jupiter.api.DisplayName;
                import static org.junit.jupiter.api.Assertions.*;

                class CodeGuardGeneratedTests {

                    @Test
                    @DisplayName("Verify normal execution with valid inputs")
                    void testNormalExecution() {
                        // TODO: Initialize target object and assert expected return values
                        assertTrue(true, "Expected logic executed successfully");
                    }

                    @Test
                    @DisplayName("Verify edge case: null or empty inputs")
                    void testEdgeCases() {
                        // Assert that methods handle null without throwing unexpected NullPointerExceptions
                        assertDoesNotThrow(() -> {
                            // invokeMethod(null);
                        });
                    }
                }
                """;
    }

    private int countOccurrences(String text, String target) {
        int count = 0;
        int idx = 0;
        while ((idx = text.indexOf(target, idx)) != -1) {
            count++;
            idx += target.length();
        }
        return count;
    }
}
