package com.codeguard.backend.dto;

import java.util.List;

public class AiReviewResponse {

    private String overview;
    private List<String> keyProblems;
    private String correctedCode;
    private String generatedTestCases;
    private String complexityAnalysis;

    public AiReviewResponse() {
    }

    public AiReviewResponse(String overview, List<String> keyProblems, String correctedCode,
                            String generatedTestCases, String complexityAnalysis) {
        this.overview = overview;
        this.keyProblems = keyProblems;
        this.correctedCode = correctedCode;
        this.generatedTestCases = generatedTestCases;
        this.complexityAnalysis = complexityAnalysis;
    }

    public String getOverview() {
        return overview;
    }

    public List<String> getKeyProblems() {
        return keyProblems;
    }

    public String getCorrectedCode() {
        return correctedCode;
    }

    public String getGeneratedTestCases() {
        return generatedTestCases;
    }

    public String getComplexityAnalysis() {
        return complexityAnalysis;
    }
}
