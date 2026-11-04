package com.codeguard.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "optimization_history")
public class OptimizationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String originalCode;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String optimizedCode;

    @Column(nullable = false)
    private String originalTimeComplexity;

    @Column(nullable = false)
    private String optimizedTimeComplexity;

    @Column(nullable = false)
    private String originalSpaceComplexity;

    @Column(nullable = false)
    private String optimizedSpaceComplexity;

    @Column(nullable = false)
    private int beforeScore;

    @Column(nullable = false)
    private int afterScore;

    @Column(length = 1000)
    private String summary;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public OptimizationHistory() {
    }

    public OptimizationHistory(String username, String originalCode, String optimizedCode,
                               String originalTimeComplexity, String optimizedTimeComplexity,
                               String originalSpaceComplexity, String optimizedSpaceComplexity,
                               int beforeScore, int afterScore, String summary) {
        this.username = username;
        this.originalCode = originalCode;
        this.optimizedCode = optimizedCode;
        this.originalTimeComplexity = originalTimeComplexity;
        this.optimizedTimeComplexity = optimizedTimeComplexity;
        this.originalSpaceComplexity = originalSpaceComplexity;
        this.optimizedSpaceComplexity = optimizedSpaceComplexity;
        this.beforeScore = beforeScore;
        this.afterScore = afterScore;
        this.summary = summary;
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public String getOriginalTimeComplexity() {
        return originalTimeComplexity;
    }

    public void setOriginalTimeComplexity(String originalTimeComplexity) {
        this.originalTimeComplexity = originalTimeComplexity;
    }

    public String getOptimizedTimeComplexity() {
        return optimizedTimeComplexity;
    }

    public void setOptimizedTimeComplexity(String optimizedTimeComplexity) {
        this.optimizedTimeComplexity = optimizedTimeComplexity;
    }

    public String getOriginalSpaceComplexity() {
        return originalSpaceComplexity;
    }

    public void setOriginalSpaceComplexity(String originalSpaceComplexity) {
        this.originalSpaceComplexity = originalSpaceComplexity;
    }

    public String getOptimizedSpaceComplexity() {
        return optimizedSpaceComplexity;
    }

    public void setOptimizedSpaceComplexity(String optimizedSpaceComplexity) {
        this.optimizedSpaceComplexity = optimizedSpaceComplexity;
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

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
