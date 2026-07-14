package com.smartgym.healthtrack.healthrecord.service;

import com.smartgym.healthtrack.healthrecord.dto.HealthRecordRequest;
import com.smartgym.healthtrack.healthrecord.dto.HealthRecordResponse;

import java.util.List;

public interface HealthRecordService {

    List<HealthRecordResponse> findAll(Boolean active);

    HealthRecordResponse findById(Long id);

    HealthRecordResponse findByMemberId(Long memberId);

    HealthRecordResponse create(HealthRecordRequest request);

    HealthRecordResponse update(
            Long id,
            HealthRecordRequest request
    );

    void deactivate(Long id);
}
