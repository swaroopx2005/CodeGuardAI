package com.codeguard.backend.analyzer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CodeAnalyzer {

    private final AlgorithmOptimizationDetector optimizationDetector;

    private static final Pattern VAR_DECL_PATTERN = Pattern.compile(
            "\\b(?:int|long|double|float|boolean|char|byte|short|String|var)\\s+([a-zA-Z_][a-zA-Z0-9_]*)\\s*(?:=|[;])"
    );

    public CodeAnalyzer() {
        this(new AlgorithmOptimizationDetector());
    }

    @Autowired
    public CodeAnalyzer(AlgorithmOptimizationDetector optimizationDetector) {
        this.optimizationDetector = optimizationDetector;
    }

    public AnalysisResult analyze(String code) {

        List<CodeIssue> issues = new ArrayList<>();

        if (code == null || code.isBlank()) {
            return new AnalysisResult(0, 0, 0, 0, 0, issues, null);
        }

        String[] lines = code.split("\n");
        int lineCount = lines.length;

        // 1. Detect possible NullPointerException
        for (int i = 0; i < lines.length; i++) {

            String line = lines[i].trim();

            if (line.contains(".length()")
                    || line.contains(".toString()")
                    || line.contains(".equals(")) {

                CodeIssue issue = new CodeIssue(
                        "HIGH",
                        i + 1,
                        "NULL_POINTER",
                        "Possible NullPointerException.",
                        "Check whether the object is null before calling a method."
                );

                issues.add(issue);
            }
        }

        // 2. Detect empty catch blocks
        for (int i = 0; i < lines.length - 1; i++) {

            String line = lines[i].trim();
            String nextLine = lines[i + 1].trim();

            if (line.startsWith("catch")
                    && nextLine.equals("}")) {

                CodeIssue issue = new CodeIssue(
                        "MEDIUM",
                        i + 1,
                        "EMPTY_CATCH",
                        "Empty catch block detected.",
                        "Handle the exception or log useful information."
                );

                issues.add(issue);
            }
        }

        // 3. Detect System.out.println (Production Logging Smell)
        for (int i = 0; i < lines.length; i++) {

            String line = lines[i].trim();

            if (line.contains("System.out.println") || line.contains("System.out.print")) {

                CodeIssue issue = new CodeIssue(
                        "LOW",
                        i + 1,
                        "SYSTEM_OUT",
                        "Avoid using System.out.println in production code.",
                        "Use a proper logger (such as SLF4J / Logback) instead of standard output."
                );

                issues.add(issue);
            }
        }

        // 4. Detect Deeply Nested If Statements (Arrow Anti-Pattern / High Cognitive Complexity)
        Deque<Boolean> scopeStack = new ArrayDeque<>();
        int ifDepth = 0;

        for (int i = 0; i < lines.length; i++) {

            String line = lines[i].trim();

            boolean isIfLine = line.startsWith("if ")
                    || line.startsWith("if(")
                    || line.contains(" if ")
                    || line.contains(" if(");

            if (isIfLine) {
                ifDepth++;
                if (ifDepth >= 3) {
                    CodeIssue issue = new CodeIssue(
                            "MEDIUM",
                            i + 1,
                            "DEEP_NESTING",
                            "Deeply nested if statement detected (nesting level: " + ifDepth + ").",
                            "Use guard clauses (early return) or extract logic into helper methods to flatten code."
                    );

                    issues.add(issue);
                }
            }

            for (char ch : line.toCharArray()) {
                if (ch == '{') {
                    scopeStack.push(isIfLine);
                } else if (ch == '}') {
                    if (!scopeStack.isEmpty()) {
                        boolean wasIfScope = scopeStack.pop();
                        if (wasIfScope && ifDepth > 0) {
                            ifDepth--;
                        }
                    }
                }
            }
        }

        // 5. Detect Very Long Methods (Maintainability & Single Responsibility Smell)
        boolean inMethod = false;
        int methodStartLine = 0;
        int methodBraceDepth = 0;
        boolean hasOpenedBrace = false;

        for (int i = 0; i < lines.length; i++) {

            String line = lines[i].trim();

            if (!inMethod) {
                boolean isMethodSignature = (line.startsWith("public ")
                        || line.startsWith("private ")
                        || line.startsWith("protected ")
                        || line.startsWith("void ")
                        || line.startsWith("static "))
                        && line.contains("(")
                        && line.contains(")")
                        && !line.contains("class ")
                        && !line.contains("interface ")
                        && !line.contains("enum ")
                        && !line.contains("record ");

                if (isMethodSignature) {
                    inMethod = true;
                    methodStartLine = i + 1;
                    methodBraceDepth = 0;
                    hasOpenedBrace = false;
                }
            }

            if (inMethod) {
                if (!hasOpenedBrace && line.endsWith(";")) {
                    inMethod = false;
                    continue;
                }

                for (char ch : line.toCharArray()) {
                    if (ch == '{') {
                        methodBraceDepth++;
                        hasOpenedBrace = true;
                    } else if (ch == '}') {
                        methodBraceDepth--;
                        if (hasOpenedBrace && methodBraceDepth == 0) {
                            int methodLength = (i + 1) - methodStartLine + 1;
                            if (methodLength > 20) {
                                CodeIssue issue = new CodeIssue(
                                        "MEDIUM",
                                        methodStartLine,
                                        "LONG_METHOD",
                                        "Method is too long (" + methodLength + " lines). Methods exceeding 20 lines reduce readability.",
                                        "Refactor by extracting sub-tasks into smaller, single-purpose helper methods."
                                );

                                issues.add(issue);
                            }
                            inMethod = false;
                            break;
                        }
                    }
                }
            }
        }

        // 6. Detect Unused Local Variables (Dead Code & Waste of Memory)
        for (int i = 0; i < lines.length; i++) {

            String line = lines[i].trim();

            if (line.startsWith("//") || line.startsWith("/*") || line.startsWith("*")) {
                continue;
            }

            Matcher matcher = VAR_DECL_PATTERN.matcher(line);

            if (matcher.find()) {
                String varName = matcher.group(1);

                boolean isUsed = false;
                Pattern varUsagePattern = Pattern.compile("\\b" + Pattern.quote(varName) + "\\b");

                for (int j = i + 1; j < lines.length; j++) {
                    String subsequentLine = lines[j];
                    if (varUsagePattern.matcher(subsequentLine).find()) {
                        isUsed = true;
                        break;
                    }
                }

                if (!isUsed) {
                    CodeIssue issue = new CodeIssue(
                            "LOW",
                            i + 1,
                            "UNUSED_VARIABLE",
                            "Variable '" + varName + "' is declared but never used.",
                            "Remove the unused variable or use it in the logic."
                    );

                    issues.add(issue);
                }
            }
        }

        // 7. Detect Algorithmic Optimization (e.g., O(n²) Nested Loop Duplicate Detection)
        AlgorithmOptimization detectedOptimization = optimizationDetector.detectDuplicateOptimization(code);
        if (detectedOptimization != null) {
            int issueLine = detectedOptimization.getContributingLines().isEmpty() ? 1 : detectedOptimization.getContributingLines().get(0);
            CodeIssue optIssue = new CodeIssue(
                    "MEDIUM",
                    issueLine,
                    "ALGORITHM_OPTIMIZATION",
                    "Quadratic O(n²) duplicate detection detected using nested loops.",
                    detectedOptimization.getRecommendation()
            );
            issues.add(optIssue);
        }

        // 8. Calculate Severity Breakdown & Weighted Score
        int highCount = 0;
        int mediumCount = 0;
        int lowCount = 0;

        for (CodeIssue issue : issues) {
            switch (issue.getSeverity().toUpperCase()) {
                case "HIGH" -> highCount++;
                case "MEDIUM" -> mediumCount++;
                case "LOW" -> lowCount++;
            }
        }

        // Weighted formula: High = -20, Medium = -10, Low = -5
        int score = 100 - (highCount * 20 + mediumCount * 10 + lowCount * 5);

        if (score < 0) {
            score = 0;
        }

        return new AnalysisResult(
                lineCount,
                score,
                highCount,
                mediumCount,
                lowCount,
                issues,
                detectedOptimization
        );
    }
}
