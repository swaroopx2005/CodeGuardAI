package com.codeguard.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "analysis_history")
public class AnalysisHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String codeSnippet;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false)
    private int lineCount;

    @Column(nullable = false)
    private int highCount;

    @Column(nullable = false)
    private int mediumCount;

    @Column(nullable = false)
    private int lowCount;

    @Column(nullable = false)
    private int totalIssues;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public AnalysisHistory() {
    }

    public AnalysisHistory(String username, String codeSnippet, int score, int lineCount,
                           int highCount, int mediumCount, int lowCount, int totalIssues) {
        this.username = username;
        this.codeSnippet = codeSnippet;
        this.score = score;
        this.lineCount = lineCount;
        this.highCount = highCount;
        this.mediumCount = mediumCount;
        this.lowCount = lowCount;
        this.totalIssues = totalIssues;
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

    public String getCodeSnippet() {
        return codeSnippet;
    }

    public void setCodeSnippet(String codeSnippet) {
        this.codeSnippet = codeSnippet;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getLineCount() {
        return lineCount;
    }

    public void setLineCount(int lineCount) {
        this.lineCount = lineCount;
    }

    public int getHighCount() {
        return highCount;
    }

    public void setHighCount(int highCount) {
        this.highCount = highCount;
    }

    public int getMediumCount() {
        return mediumCount;
    }

    public void setMediumCount(int mediumCount) {
        this.mediumCount = mediumCount;
    }

    public int getLowCount() {
        return lowCount;
    }

    public void setLowCount(int lowCount) {
        this.lowCount = lowCount;
    }

    public int getTotalIssues() {
        return totalIssues;
    }

    public void setTotalIssues(int totalIssues) {
        this.totalIssues = totalIssues;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
