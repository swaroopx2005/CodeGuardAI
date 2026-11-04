package com.codeguard.backend.analyzer;

public class CodeIssue {

    private String severity;
    private int line;
    private String type;
    private String message;
    private String suggestion;

    public CodeIssue(
            String severity,
            int line,
            String type,
            String message,
            String suggestion) {

        this.severity = severity;
        this.line = line;
        this.type = type;
        this.message = message;
        this.suggestion = suggestion;
    }

    public String getSeverity() {
        return severity;
    }

    public int getLine() {
        return line;
    }

    public String getType() {
        return type;
    }

    public String getMessage() {
        return message;
    }

    public String getSuggestion() {
        return suggestion;
    }
}