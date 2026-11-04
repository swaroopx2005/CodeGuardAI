package com.codeguard.backend.dto;

public class OptimizationResponse {

    private boolean canOptimize;
    private String type;
    private String title;
    private String summary;
    private ComplexityInfo originalComplexity;
    private ComplexityInfo optimizedComplexity;
    private String originalCode;
    private String optimizedCode;
    private String explanation;
    private String tradeoffs;
    private String tradeoff;
    private String improvement;
    private String algorithmRecommendation;
    private int beforeScore;
    private int afterScore;
    private String scoreImprovementReason;

    public OptimizationResponse() {
    }

    public static OptimizationResponse notOptimizable(String summary, ComplexityInfo currentComplexity, int currentScore) {
        OptimizationResponse res = new OptimizationResponse();
        res.canOptimize = false;
        res.type = "NONE";
        res.title = summary;
        res.summary = summary;
        res.originalComplexity = currentComplexity;
        res.optimizedComplexity = currentComplexity;
        res.beforeScore = currentScore;
        res.afterScore = currentScore;
        res.explanation = "The algorithm is already implemented with appropriate algorithmic complexity.";
        res.tradeoffs = "No trade-offs required.";
        res.tradeoff = "No trade-offs required.";
        res.improvement = "0% (Already optimal)";
        return res;
    }

    public boolean isCanOptimize() {
        return canOptimize;
    }

    public void setCanOptimize(boolean canOptimize) {
        this.canOptimize = canOptimize;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
        if (this.summary == null) {
            this.summary = title;
        }
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
        if (this.title == null) {
            this.title = summary;
        }
    }

    public ComplexityInfo getOriginalComplexity() {
        return originalComplexity;
    }

    public void setOriginalComplexity(ComplexityInfo originalComplexity) {
        this.originalComplexity = originalComplexity;
    }

    public ComplexityInfo getOptimizedComplexity() {
        return optimizedComplexity;
    }

    public void setOptimizedComplexity(ComplexityInfo optimizedComplexity) {
        this.optimizedComplexity = optimizedComplexity;
    }

    public String getOriginalCode() {
        return originalCode;
    }

    public void setOriginalCode(String originalCode) {
        this.originalCode = originalCode;
    }

    public String getOptimizedCode() {
        return optimizedCode;
    }

    public void setOptimizedCode(String optimizedCode) {
        this.optimizedCode = optimizedCode;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getTradeoffs() {
        return tradeoffs;
    }

    public void setTradeoffs(String tradeoffs) {
        this.tradeoffs = tradeoffs;
        this.tradeoff = tradeoffs;
    }

    public String getTradeoff() {
        return tradeoff != null ? tradeoff : tradeoffs;
    }

    public void setTradeoff(String tradeoff) {
        this.tradeoff = tradeoff;
        this.tradeoffs = tradeoff;
    }

    public String getImprovement() {
        return improvement;
    }

    public void setImprovement(String improvement) {
        this.improvement = improvement;
    }

    public String getAlgorithmRecommendation() {
        return algorithmRecommendation;
    }

    public void setAlgorithmRecommendation(String algorithmRecommendation) {
        this.algorithmRecommendation = algorithmRecommendation;
    }

    public int getBeforeScore() {
        return beforeScore;
    }

    public void setBeforeScore(int beforeScore) {
        this.beforeScore = beforeScore;
    }

    public int getAfterScore() {
        return afterScore;
    }

    public void setAfterScore(int afterScore) {
        this.afterScore = afterScore;
    }

    public String getScoreImprovementReason() {
        return scoreImprovementReason;
    }

    public void setScoreImprovementReason(String scoreImprovementReason) {
        this.scoreImprovementReason = scoreImprovementReason;
    }
}
