package com.codeguard.backend.analyzer;

import java.util.List;

public class AnalysisResult {

    private int lineCount;
    private int score;
    private int highCount;
    private int mediumCount;
    private int lowCount;
    private List<CodeIssue> issues;
    private AlgorithmOptimization optimization;

    public AnalysisResult(int lineCount, int score, int highCount, int mediumCount, int lowCount, List<CodeIssue> issues) {
        this(lineCount, score, highCount, mediumCount, lowCount, issues, null);
    }

    public AnalysisResult(int lineCount, int score, int highCount, int mediumCount, int lowCount, List<CodeIssue> issues, AlgorithmOptimization optimization) {
        this.lineCount = lineCount;
        this.score = score;
        this.highCount = highCount;
        this.mediumCount = mediumCount;
        this.lowCount = lowCount;
        this.issues = issues;
        this.optimization = optimization;
    }

    public int getLineCount() {
        return lineCount;
    }

    public int getScore() {
        return score;
    }

    public int getHighCount() {
        return highCount;
    }

    public int getMediumCount() {
        return mediumCount;
    }

    public int getLowCount() {
        return lowCount;
    }

    public List<CodeIssue> getIssues() {
        return issues;
    }

    public AlgorithmOptimization getOptimization() {
        return optimization;
    }

    public void setOptimization(AlgorithmOptimization optimization) {
        this.optimization = optimization;
    }
}
