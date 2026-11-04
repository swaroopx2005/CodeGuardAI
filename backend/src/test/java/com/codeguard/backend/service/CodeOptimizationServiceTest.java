package com.codeguard.backend.service;

import com.codeguard.backend.analyzer.CodeAnalyzer;
import com.codeguard.backend.dto.OptimizationRequest;
import com.codeguard.backend.dto.OptimizationResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CodeOptimizationServiceTest {

    private final CodeAnalyzer analyzer = new CodeAnalyzer();
    private final CodeOptimizationService service = new CodeOptimizationService(analyzer);

    @Test
    void testNestedLoopDuplicateOptimization() {
        String codeWithNestedLoops = """
                public class Duplicates {
                    public boolean check(int[] arr) {
                        for (int i = 0; i < arr.length; i++) {
                            for (int j = i + 1; j < arr.length; j++) {
                                if (arr[i] == arr[j]) return true;
                            }
                        }
                        return false;
                    }
                }
                """;

        OptimizationRequest req = new OptimizationRequest(codeWithNestedLoops, "java", null);
        OptimizationResponse res = service.optimizeCode(req);

        assertTrue(res.isCanOptimize());
        assertEquals("O(n²)", res.getOriginalComplexity().getTime());
        assertEquals("O(n) average", res.getOptimizedComplexity().getTime());
        assertEquals("O(n)", res.getOptimizedComplexity().getSpace());
        assertTrue(res.getOptimizedCode().contains("HashSet"));
        assertNotNull(res.getTradeoffs());
        assertTrue(res.getTradeoffs().toLowerCase().contains("memory"));
    }

    @Test
    void testGenericNestedLoopsDoNotTriggerHashSetOptimization() {
        String genericLoops = """
                public class GridPrinter {
                    public void printGrid(int rows, int cols) {
                        for (int r = 0; r < rows; r++) {
                            for (int c = 0; c < cols; c++) {
                                System.out.println(r + "," + c);
                            }
                        }
                    }
                }
                """;

        OptimizationRequest req = new OptimizationRequest(genericLoops, "java", null);
        OptimizationResponse res = service.optimizeCode(req);

        // Grid printing loops must NOT be converted to HashSet!
        assertFalse(res.isCanOptimize(), "Generic nested loops should not be flagged as HashSet duplicate optimization");
    }

    @Test
    void testStringConcatenationInLoopOptimization() {
        String codeWithConcat = """
                public class Aggregator {
                    public String build(String[] words) {
                        String s = "";
                        for (int i = 0; i < words.length; i++) {
                            s += words[i];
                        }
                        return s;
                    }
                }
                """;

        OptimizationRequest req = new OptimizationRequest(codeWithConcat, "java", null);
        OptimizationResponse res = service.optimizeCode(req);

        assertTrue(res.isCanOptimize());
        assertEquals("O(n²)", res.getOriginalComplexity().getTime());
        assertEquals("O(n)", res.getOptimizedComplexity().getTime());
        assertTrue(res.getOptimizedCode().contains("StringBuilder"));
    }

    @Test
    void testAlreadyOptimalCodeNotFabricated() {
        String cleanCode = """
                public class QuickMath {
                    public int add(int a, int b) {
                        return a + b;
                    }
                }
                """;

        OptimizationRequest req = new OptimizationRequest(cleanCode, "java", null);
        OptimizationResponse res = service.optimizeCode(req);

        assertFalse(res.isCanOptimize());
        assertEquals("O(1)", res.getOriginalComplexity().getTime());
        assertEquals("O(1)", res.getOptimizedComplexity().getTime());
    }
}
