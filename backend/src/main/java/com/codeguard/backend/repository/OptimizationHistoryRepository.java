package com.codeguard.backend.repository;

import com.codeguard.backend.entity.OptimizationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OptimizationHistoryRepository extends JpaRepository<OptimizationHistory, Long> {

    List<OptimizationHistory> findByUsernameOrderByCreatedAtDesc(String username);
}
