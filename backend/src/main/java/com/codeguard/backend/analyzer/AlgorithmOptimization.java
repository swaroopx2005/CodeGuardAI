package com.codeguard.backend.analyzer;

import java.util.ArrayList;
import java.util.List;

/**
 * Model representing an algorithmic optimization detected by CodeGuard AI.
 */
public class AlgorithmOptimization {

    private String type;
    private String title;
    private String originalComplexity;
    private String optimizedComplexity;
    private String spaceComplexity;
    private String explanation;
    private String tradeoff;
    private String recommendation;
    private String originalCode;
    private String optimizedCode;
    private List<Integer> contributingLines = new ArrayList<>();

    public AlgorithmOptimization() {
    }

    public AlgorithmOptimization(String type,
                                 String title,
                                 String originalComplexity,
                                 String optimizedComplexity,
                                 String spaceComplexity,
                                 String explanation,
                                 String tradeoff,
                                 String recommendation,
                                 String originalCode,
                                 String optimizedCode,
                                 List<Integer> contributingLines) {
        this.type = type;
        this.title = title;
        this.originalComplexity = originalComplexity;
        this.optimizedComplexity = optimizedComplexity;
        this.spaceComplexity = spaceComplexity;
        this.explanation = explanation;
        this.tradeoff = tradeoff;
        this.recommendation = recommendation;
        this.originalCode = originalCode;
        this.optimizedCode = optimizedCode;
        this.contributingLines = contributingLines != null ? contributingLines : new ArrayList<>();
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
    }

    public String getOriginalComplexity() {
        return originalComplexity;
    }

    public void setOriginalComplexity(String originalComplexity) {
        this.originalComplexity = originalComplexity;
    }

    public String getOptimizedComplexity() {
        return optimizedComplexity;
    }

    public void setOptimizedComplexity(String optimizedComplexity) {
        this.optimizedComplexity = optimizedComplexity;
    }

    public String getSpaceComplexity() {
        return spaceComplexity;
    }

    public void setSpaceComplexity(String spaceComplexity) {
        this.spaceComplexity = spaceComplexity;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getTradeoff() {
        return tradeoff;
    }

    public void setTradeoff(String tradeoff) {
        this.tradeoff = tradeoff;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
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

    public List<Integer> getContributingLines() {
        return contributingLines;
    }

    public void setContributingLines(List<Integer> contributingLines) {
        this.contributingLines = contributingLines;
    }
}
