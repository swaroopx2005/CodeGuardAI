package com.codeguard.backend.repository;

import com.codeguard.backend.entity.AnalysisHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalysisHistoryRepository extends JpaRepository<AnalysisHistory, Long> {

    List<AnalysisHistory> findByUsernameOrderByCreatedAtDesc(String username);
}
