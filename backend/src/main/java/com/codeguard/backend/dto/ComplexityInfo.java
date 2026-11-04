package com.codeguard.backend.dto;

import java.util.List;

public class ComplexityInfo {
    private String time;
    private String space;
    private int timeRank;
    private int spaceRank;
    private String explanation;
    private List<Integer> contributingLines;

    public ComplexityInfo() {
    }

    public ComplexityInfo(String time, String space, int timeRank, int spaceRank,
                          String explanation, List<Integer> contributingLines) {
        this.time = time;
        this.space = space;
        this.timeRank = timeRank;
        this.spaceRank = spaceRank;
        this.explanation = explanation;
        this.contributingLines = contributingLines;
    }

    public String getTime() {
        return time;
    }

    public String getSpace() {
        return space;
    }

    public int getTimeRank() {
        return timeRank;
    }

    public int getSpaceRank() {
        return spaceRank;
    }

    public String getExplanation() {
        return explanation;
    }

    public List<Integer> getContributingLines() {
        return contributingLines;
    }
}
