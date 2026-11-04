package com.codeguard.backend.dto;

import java.util.Map;

public class OptimizationRequest {

    private String code;
    private String language;
    private Map<String, Object> analysis;

    public OptimizationRequest() {
    }

    public OptimizationRequest(String code, String language, Map<String, Object> analysis) {
        this.code = code;
        this.language = language;
        this.analysis = analysis;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Map<String, Object> getAnalysis() {
        return analysis;
    }

    public void setAnalysis(Map<String, Object> analysis) {
        this.analysis = analysis;
    }
}
