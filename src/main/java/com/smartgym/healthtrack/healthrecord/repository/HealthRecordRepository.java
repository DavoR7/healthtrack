package com.smartgym.healthtrack.healthrecord.repository;

import com.smartgym.healthtrack.healthrecord.model.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HealthRecordRepository
        extends JpaRepository<HealthRecord, Long> {

    Optional<HealthRecord> findByMemberId(Long memberId);

    boolean existsByMemberId(Long memberId);

    List<HealthRecord> findAllByOrderByCreatedAtDesc();

    List<HealthRecord> findByActiveOrderByCreatedAtDesc(
            Boolean active
    );
}
