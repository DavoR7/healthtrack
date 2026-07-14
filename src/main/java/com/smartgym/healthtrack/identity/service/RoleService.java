package com.smartgym.healthtrack.identity.service;

import com.smartgym.healthtrack.identity.dto.RoleRequest;
import com.smartgym.healthtrack.identity.dto.RoleResponse;

import java.util.List;

public interface RoleService {

    List<RoleResponse> findAll();

    RoleResponse findById(Long id);

    RoleResponse create(RoleRequest request);

    RoleResponse update(Long id, RoleRequest request);

    void delete(Long id);
}