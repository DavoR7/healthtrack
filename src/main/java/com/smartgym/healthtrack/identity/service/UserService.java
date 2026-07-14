package com.smartgym.healthtrack.identity.service;

import com.smartgym.healthtrack.identity.dto.UserRequest;
import com.smartgym.healthtrack.identity.dto.UserResponse;
import com.smartgym.healthtrack.identity.dto.UserUpdateRequest;

import java.util.List;

public interface UserService {

    List<UserResponse> findAll();

    UserResponse findById(Long id);

    UserResponse create(UserRequest request);

    UserResponse update(Long id, UserUpdateRequest request);

    void delete(Long id);
}