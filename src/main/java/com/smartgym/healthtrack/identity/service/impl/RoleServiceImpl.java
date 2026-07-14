package com.smartgym.healthtrack.identity.service.impl;

import com.smartgym.healthtrack.identity.dto.RoleRequest;
import com.smartgym.healthtrack.identity.dto.RoleResponse;
import com.smartgym.healthtrack.identity.model.Role;
import com.smartgym.healthtrack.identity.repository.RoleRepository;
import com.smartgym.healthtrack.identity.service.RoleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> findAll() {
        return roleRepository.findAllByOrderByNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponse findById(Long id) {
        return toResponse(findEntityById(id));
    }

    @Override
    public RoleResponse create(RoleRequest request) {
        String normalizedCode = normalizeCode(request.code());

        if (roleRepository.existsByCode(normalizedCode)) {
            throw new IllegalArgumentException(
                    "Ya existe un rol con el código: " + normalizedCode
            );
        }

        Role role = new Role();
        role.setCode(normalizedCode);
        role.setName(request.name().trim());
        role.setDescription(normalizeDescription(request.description()));
        role.setActive(request.active() == null || request.active());

        return toResponse(roleRepository.save(role));
    }

    @Override
    public RoleResponse update(Long id, RoleRequest request) {
        Role role = findEntityById(id);
        String normalizedCode = normalizeCode(request.code());

        roleRepository.findByCode(normalizedCode)
                .filter(existingRole -> !existingRole.getId().equals(id))
                .ifPresent(existingRole -> {
                    throw new IllegalArgumentException(
                            "Ya existe un rol con el código: " + normalizedCode
                    );
                });

        role.setCode(normalizedCode);
        role.setName(request.name().trim());
        role.setDescription(normalizeDescription(request.description()));

        if (request.active() != null) {
            role.setActive(request.active());
        }

        return toResponse(roleRepository.save(role));
    }

    @Override
    public void delete(Long id) {
        Role role = findEntityById(id);
        roleRepository.delete(role);
    }

    private Role findEntityById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No se encontró el rol con ID: " + id
                        )
                );
    }

    private String normalizeCode(String code) {
        String normalized = code.trim().toUpperCase();

        if (!normalized.startsWith("ROLE_")) {
            normalized = "ROLE_" + normalized;
        }

        return normalized.replaceAll("\\s+", "_");
    }

    private String normalizeDescription(String description) {
        if (description == null || description.isBlank()) {
            return null;
        }

        return description.trim();
    }

    private RoleResponse toResponse(Role role) {
        return new RoleResponse(
                role.getId(),
                role.getCode(),
                role.getName(),
                role.getDescription(),
                role.getActive()
        );
    }
}