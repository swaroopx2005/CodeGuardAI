# =====================================================================
# CodeGuard AI - Multi-Stage Production Dockerfile
# Combines React + Vite Frontend and Spring Boot Java 21 Backend
# Runs as a single, self-contained, lightning-fast container.
# Deployable with 1-click to Render, Railway, Fly.io, AWS, or GCP.
# =====================================================================

# Stage 1: Build the React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Spring Boot Backend with embedded static frontend
FROM eclipse-temurin:21-jdk-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/.mvn .mvn
COPY backend/mvnw backend/pom.xml ./
RUN chmod +x mvnw
# Cache maven dependencies
RUN ./mvnw dependency:go-offline -B || true
COPY backend/src ./src
# Copy built static frontend files into Spring Boot static resources directory
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static
RUN ./mvnw clean package -DskipTests

# Stage 3: Lightweight JRE 21 Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

# Run with optimized container memory flags
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
