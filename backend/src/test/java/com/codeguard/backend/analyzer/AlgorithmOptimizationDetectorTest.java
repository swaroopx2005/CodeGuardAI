package com.codeguard.backend.analyzer;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AlgorithmOptimizationDetectorTest {

    private final AlgorithmOptimizationDetector detector = new AlgorithmOptimizationDetector();
    private final CodeAnalyzer analyzer = new CodeAnalyzer(detector);

    @Test
    void testDetectsDuplicatePatternExact() {
        String duplicateCode = """
                public static boolean findDuplicateSlow(int[] numbers) {
                    for (int i = 0; i < numbers.length; i++) {
                        for (int j = i + 1; j < numbers.length; j++) {
                            if (numbers[i] == numbers[j]) {
                                return true;
                            }
                        }
                    }
                    return false;
                }
                """;

        AlgorithmOptimization opt = detector.detectDuplicateOptimization(duplicateCode);

        assertNotNull(opt, "Expected optimization to be detected for nested loop duplicate search");
        assertEquals("ALGORITHM_OPTIMIZATION", opt.getType());
        assertEquals("Optimize duplicate detection", opt.getTitle());
        assertEquals("O(n²)", opt.getOriginalComplexity());
        assertEquals("O(n) average", opt.getOptimizedComplexity());
        assertEquals("O(n)", opt.getSpaceComplexity());
        assertTrue(opt.getExplanation().contains("HashSet"));
        assertTrue(opt.getTradeoff().contains("memory"));
        assertTrue(opt.getOptimizedCode().contains("import java.util.HashSet;"));
        assertTrue(opt.getOptimizedCode().contains("!seen.add(element)"));
        assertEquals(3, opt.getContributingLines().size());
    }

    @Test
    void testRejectsArbitraryNestedLoops() {
        String genericLoops = """
                public void processTasks() {
                    for (int i = 0; i < 10; i++) {
                        for (int j = 0; j < 10; j++) {
                            doSomething();
                        }
                    }
                }
                """;

        AlgorithmOptimization opt = detector.detectDuplicateOptimization(genericLoops);
        assertNull(opt, "Arbitrary nested loops must NOT trigger duplicate detection optimization");
    }

    @Test
    void testRejectsMatrixTraversal() {
        String matrixCode = """
                public void printMatrix(int[][] matrix) {
                    for (int i = 0; i < matrix.length; i++) {
                        for (int j = 0; j < matrix[i].length; j++) {
                            System.out.println(matrix[i][j]);
                        }
                    }
                }
                """;

        AlgorithmOptimization opt = detector.detectDuplicateOptimization(matrixCode);
        assertNull(opt, "Matrix traversal must NOT trigger duplicate detection optimization");
    }

    @Test
    void testRejectsPairSumWithoutEquality() {
        String pairSumCode = """
                public int sumPairs(int[] arr) {
                    int total = 0;
                    for (int i = 0; i < arr.length; i++) {
                        for (int j = i + 1; j < arr.length; j++) {
                            total += (arr[i] + arr[j]);
                        }
                    }
                    return total;
                }
                """;

        AlgorithmOptimization opt = detector.detectDuplicateOptimization(pairSumCode);
        assertNull(opt, "Pair calculations without equality checks must NOT trigger duplicate optimization");
    }

    @Test
    void testCodeAnalyzerIntegratesOptimization() {
        String duplicateCode = """
                public static boolean findDuplicateSlow(int[] numbers) {
                    for (int i = 0; i < numbers.length; i++) {
                        for (int j = i + 1; j < numbers.length; j++) {
                            if (numbers[i] == numbers[j]) {
                                return true;
                            }
                        }
                    }
                    return false;
                }
                """;

        AnalysisResult result = analyzer.analyze(duplicateCode);

        assertNotNull(result);
        assertNotNull(result.getOptimization(), "AnalysisResult must contain the detected AlgorithmOptimization");
        assertEquals("ALGORITHM_OPTIMIZATION", result.getOptimization().getType());

        boolean hasOptIssue = result.getIssues().stream()
                .anyMatch(issue -> "ALGORITHM_OPTIMIZATION".equals(issue.getType()));
        assertTrue(hasOptIssue, "AnalysisResult issues must contain an ALGORITHM_OPTIMIZATION issue");
    }
}
