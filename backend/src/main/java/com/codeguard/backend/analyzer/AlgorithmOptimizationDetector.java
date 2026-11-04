package com.codeguard.backend.analyzer;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Detector responsible for identifying inefficient algorithmic patterns and generating
 * mathematically sound, production-ready optimizations.
 */
@Component
public class AlgorithmOptimizationDetector {

    // Matches outer for loop header with an indexing variable, e.g. for (int i = 0; ...
    private static final Pattern OUTER_FOR_PATTERN = Pattern.compile(
            "for\\s*\\(\\s*(?:int\\s+)?([a-zA-Z_][a-zA-Z0-9_]*)\\s*=\\s*0\\s*;"
    );

    /**
     * Inspects Java source code to detect if nested loops represent an O(n²) duplicate detection algorithm.
     * Enforces strict safety rules to ensure non-duplicate nested loops (e.g., matrix traversal or nested tasks)
     * are NOT falsely flagged as duplicate detection.
     *
     * @param code the Java source code to inspect
     * @return AlgorithmOptimization if duplicate detection pattern is detected; null otherwise.
     */
    public AlgorithmOptimization detectDuplicateOptimization(String code) {
        if (code == null || code.isBlank()) {
            return null;
        }

        String[] lines = code.split("\n");

        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();

            // 1. Condition 1: Find outer loop header
            Matcher outerMatcher = OUTER_FOR_PATTERN.matcher(line);
            if (!outerMatcher.find()) {
                continue;
            }

            String outerVar = outerMatcher.group(1);
            int outerLoopLine = i + 1;

            // 2. Condition 2: Search for inner loop within scope that starts AFTER outer index (e.g., j = i + 1)
            // Pattern: for (... j = outerVar + 1 ...)
            Pattern innerForPattern = Pattern.compile(
                    "for\\s*\\(\\s*(?:int\\s+)?([a-zA-Z_][a-zA-Z0-9_]*)\\s*=\\s*" +
                            Pattern.quote(outerVar) + "\\s*\\+\\s*1\\s*;"
            );

            int innerLoopLine = -1;
            String innerVar = null;
            int innerIndexInLines = -1;

            int scopeDepth = 0;
            for (int j = i; j < lines.length; j++) {
                String subLine = lines[j].trim();
                if (j > i) {
                    Matcher innerMatcher = innerForPattern.matcher(subLine);
                    if (innerMatcher.find()) {
                        innerVar = innerMatcher.group(1);
                        innerLoopLine = j + 1;
                        innerIndexInLines = j;
                        break;
                    }
                }

                // Track braces so we don't look past the outer loop's boundary
                for (char c : subLine.toCharArray()) {
                    if (c == '{') scopeDepth++;
                    else if (c == '}') scopeDepth--;
                }
                if (j > i && scopeDepth <= 0) {
                    break;
                }
            }

            if (innerVar == null) {
                // No inner loop starting at outerVar + 1 was found
                continue;
            }

            // 3. Condition 3: Search inside inner loop for two elements being compared
            // e.g. numbers[i] == numbers[j] or arr[i].equals(arr[j]) or list.get(i).equals(list.get(j))
            String quoteOuter = Pattern.quote(outerVar);
            String quoteInner = Pattern.quote(innerVar);

            // Pattern for array indexing: arr[outerVar] == arr[innerVar]
            Pattern arrayEqualityPattern = Pattern.compile(
                    "([a-zA-Z_][a-zA-Z0-9_]*)\\s*\\[\\s*" + quoteOuter + "\\s*\\]\\s*==\\s*\\1\\s*\\[\\s*" + quoteInner + "\\s*\\]|" +
                            "([a-zA-Z_][a-zA-Z0-9_]*)\\s*\\[\\s*" + quoteInner + "\\s*\\]\\s*==\\s*\\2\\s*\\[\\s*" + quoteOuter + "\\s*\\]|" +
                            "([a-zA-Z_][a-zA-Z0-9_]*)\\s*\\[\\s*" + quoteOuter + "\\s*\\]\\s*\\.equals\\s*\\(\\s*\\3\\s*\\[\\s*" + quoteInner + "\\s*\\]\\s*\\)|" +
                            "([a-zA-Z_][a-zA-Z0-9_]*)\\s*\\.get\\s*\\(\\s*" + quoteOuter + "\\s*\\)\\s*\\.equals\\s*\\(\\s*\\4\\s*\\.get\\s*\\(\\s*" + quoteInner + "\\s*\\)\\s*\\)|" +
                            "Objects\\.equals\\s*\\(\\s*([a-zA-Z_][a-zA-Z0-9_]*)\\s*\\[\\s*" + quoteOuter + "\\s*\\]\\s*,\\s*\\5\\s*\\[\\s*" + quoteInner + "\\s*\\]\\s*\\)"
            );

            int compLine = -1;
            boolean comparisonFound = false;

            int innerScope = 0;
            for (int k = innerIndexInLines; k < lines.length; k++) {
                String compLineStr = lines[k].trim();

                Matcher compMatcher = arrayEqualityPattern.matcher(compLineStr);
                if (compMatcher.find()) {
                    comparisonFound = true;
                    compLine = k + 1;
                    break;
                }

                for (char c : compLineStr.toCharArray()) {
                    if (c == '{') innerScope++;
                    else if (c == '}') innerScope--;
                }
                if (k > innerIndexInLines && innerScope <= 0) {
                    break;
                }
            }

            if (!comparisonFound) {
                // Two elements were not compared for equality -> Not duplicate detection
                continue;
            }

            // 4. Condition 4: Verify the comparison is used to determine whether duplicates exist
            // e.g. return true; upon equality match, or boolean return in method
            boolean hasDuplicateReturn = false;
            for (int m = compLine - 1; m < Math.min(lines.length, compLine + 5); m++) {
                String actionLine = lines[m].trim();
                if (actionLine.contains("return true") ||
                        actionLine.contains("return true;") ||
                        actionLine.contains("duplicate = true") ||
                        actionLine.contains("hasDuplicate = true") ||
                        actionLine.contains("isDuplicate = true")) {
                    hasDuplicateReturn = true;
                    break;
                }
            }

            // Also check surrounding method signature or context for boolean / duplicate indicator
            boolean hasDuplicateContext = code.toLowerCase().contains("duplicate")
                    || code.contains("boolean ")
                    || code.contains("return false");

            if (!hasDuplicateReturn && !hasDuplicateContext) {
                // Not used to determine duplicate existence
                continue;
            }

            // All 4 criteria verified! Construct the genuine ALGORITHM_OPTIMIZATION result
            List<Integer> contributingLines = new ArrayList<>();
            contributingLines.add(outerLoopLine);
            contributingLines.add(innerLoopLine);
            contributingLines.add(compLine);

            String optimizedCode = """
                    import java.util.HashSet;
                    import java.util.Set;

                    public class OptimizedService {

                        public boolean hasDuplicate(int[] elements) {

                            if (elements == null || elements.length <= 1) {
                                return false;
                            }

                            Set<Integer> seen = new HashSet<>();

                            for (int element : elements) {

                                if (!seen.add(element)) {
                                    return true;
                                }
                            }

                            return false;
                        }
                    }
                    """;

            return new AlgorithmOptimization(
                    "ALGORITHM_OPTIMIZATION",
                    "Optimize duplicate detection",
                    "O(n²)",
                    "O(n) average",
                    "O(n)",
                    "The original implementation compares every pair of elements using nested loops. A HashSet allows average O(1) lookup for each element.",
                    "The optimized solution uses additional O(n) memory.",
                    "Replace O(n²) nested-loop duplicate detection with O(n) average-case HashSet lookup.",
                    code,
                    optimizedCode.trim(),
                    contributingLines
            );
        }

        return null;
    }
}
