package com.smartgym.healthtrack.members.service;

import com.smartgym.healthtrack.members.dto.MemberRequest;
import com.smartgym.healthtrack.members.dto.MemberResponse;

import java.util.List;

public interface MemberService {

    List<MemberResponse> findAll(Boolean active);

    MemberResponse findById(Long id);

    MemberResponse create(MemberRequest request);

    MemberResponse update(Long id, MemberRequest request);

    void deactivate(Long id);
}