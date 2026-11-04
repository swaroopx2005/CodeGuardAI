package com.codeguard.backend.analyzer;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CodeAnalyzerTest {

    private final CodeAnalyzer analyzer = new CodeAnalyzer();

    @Test
    void testSystemOutDetection() {
        String sampleCode = """
                public class OrderService {
                    public void process() {
                        System.out.println("Processing order...");
                    }
                }
                """;

        AnalysisResult result = analyzer.analyze(sampleCode);

        assertNotNull(result);
        assertEquals(5, result.getLineCount());
        assertEquals(95, result.getScore()); // 100 - 5 (LOW)
        assertEquals(0, result.getHighCount());
        assertEquals(0, result.getMediumCount());
        assertEquals(1, result.getLowCount());
        assertEquals(1, result.getIssues().size());

        CodeIssue issue = result.getIssues().get(0);
        assertEquals("SYSTEM_OUT", issue.getType());
        assertEquals("LOW", issue.getSeverity());
        assertEquals(3, issue.getLine());
        assertEquals("Avoid using System.out.println in production code.", issue.getMessage());
    }

    @Test
    void testDeeplyNestedIfDetection() {
        String sampleCode = """
                public class DiscountCalculator {
                    public void calculate(boolean isMember, boolean hasCoupon, boolean isHoliday) {
                        if (isMember) {
                            if (hasCoupon) {
                                if (isHoliday) {
                                    applySpecialDiscount();
                                }
                            }
                        }
                    }
                }
                """;

        AnalysisResult result = analyzer.analyze(sampleCode);

        assertNotNull(result);
        assertEquals(11, result.getLineCount());
        assertEquals(1, result.getMediumCount());
        assertEquals(90, result.getScore()); // 100 - 10 (MEDIUM)

        CodeIssue issue = result.getIssues().stream()
                .filter(i -> "DEEP_NESTING".equals(i.getType()))
                .findFirst()
                .orElse(null);

        assertNotNull(issue, "Expected a DEEP_NESTING issue");
        assertEquals("MEDIUM", issue.getSeverity());
        assertEquals(5, issue.getLine());
        assertEquals("DEEP_NESTING", issue.getType());
    }

    @Test
    void testLongMethodDetection() {
        String sampleCode = """
                public class ReportGenerator {
                    public void generateReport() {
                        int a = 1;
                        int b = 2;
                        int c = 3;
                        int d = 4;
                        int e = 5;
                        int f = 6;
                        int g = 7;
                        int h = 8;
                        int i = 9;
                        int j = 10;
                        int k = 11;
                        int l = 12;
                        int m = 13;
                        int n = 14;
                        int o = 15;
                        int p = 16;
                        int q = 17;
                        int r = 18;
                        int s = 19;
                        int t = 20;
                    }
                }
                """;

        AnalysisResult result = analyzer.analyze(sampleCode);

        assertNotNull(result);
        assertFalse(result.getIssues().isEmpty());

        CodeIssue issue = result.getIssues().stream()
                .filter(iss -> "LONG_METHOD".equals(iss.getType()))
                .findFirst()
                .orElse(null);

        assertNotNull(issue, "Expected a LONG_METHOD issue");
        assertEquals("MEDIUM", issue.getSeverity());
        assertEquals(2, issue.getLine());
    }

    @Test
    void testUnusedVariableDetection() {
        String sampleCode = """
                public class Calculator {
                    public int calculateTotal() {
                        int unusedScore = 100;
                        int baseScore = 50;
                        return baseScore + 10;
                    }
                }
                """;

        AnalysisResult result = analyzer.analyze(sampleCode);

        assertNotNull(result);
        assertFalse(result.getIssues().isEmpty());

        CodeIssue issue = result.getIssues().stream()
                .filter(iss -> "UNUSED_VARIABLE".equals(iss.getType()))
                .findFirst()
                .orElse(null);

        assertNotNull(issue, "Expected an UNUSED_VARIABLE issue");
        assertEquals("LOW", issue.getSeverity());
        assertEquals(3, issue.getLine());
        assertTrue(issue.getMessage().contains("unusedScore"));
    }
}
