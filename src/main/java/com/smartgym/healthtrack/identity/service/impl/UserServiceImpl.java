package com.smartgym.healthtrack.identity.service.impl;

import com.smartgym.healthtrack.identity.dto.*;
import com.smartgym.healthtrack.identity.model.Role;
import com.smartgym.healthtrack.identity.model.User;
import com.smartgym.healthtrack.identity.repository.RoleRepository;
import com.smartgym.healthtrack.identity.repository.UserRepository;
import com.smartgym.healthtrack.identity.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAllByOrderByLastNameAscFirstNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        return toResponse(findEntityById(id));
    }

    @Override
    public UserResponse create(UserRequest request) {
        validateUniqueUsername(request.username(), null);
        validateUniqueEmail(request.email(), null);

        User user = new User();
        user.setUsername(normalizeUsername(request.username()));
        user.setEmail(normalizeEmail(request.email()));
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setActive(request.active() == null || request.active());
        user.setLocked(request.locked() != null && request.locked());
        user.setRoles(resolveRoles(request.roleIds()));

        return toResponse(userRepository.save(user));
    }

    @Override
    public UserResponse update(Long id, UserUpdateRequest request) {
        User user = findEntityById(id);

        validateUniqueUsername(request.username(), id);
        validateUniqueEmail(request.email(), id);

        user.setUsername(normalizeUsername(request.username()));
        user.setEmail(normalizeEmail(request.email()));
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setRoles(resolveRoles(request.roleIds()));

        if (request.password() != null && !request.password().isBlank()) {
            user.setPasswordHash(
                    passwordEncoder.encode(request.password())
            );
        }

        if (request.active() != null) {
            user.setActive(request.active());
        }

        if (request.locked() != null) {
            user.setLocked(request.locked());
        }

        return toResponse(userRepository.save(user));
    }

    @Override
    public void delete(Long id) {
        User user = findEntityById(id);
        userRepository.delete(user);
    }

    private User findEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No se encontró el usuario con ID: " + id
                        )
                );
    }

    private Set<Role> resolveRoles(Set<Long> roleIds) {
        List<Role> roles = roleRepository.findAllById(roleIds);

        if (roles.size() != roleIds.size()) {
            throw new IllegalArgumentException(
                    "Uno o varios roles seleccionados no existen"
            );
        }

        return new HashSet<>(roles);
    }

    private void validateUniqueUsername(String username, Long currentId) {
        userRepository.findByUsernameIgnoreCase(normalizeUsername(username))
                .filter(user -> !user.getId().equals(currentId))
                .ifPresent(user -> {
                    throw new IllegalArgumentException(
                            "El nombre de usuario ya está registrado"
                    );
                });
    }

    private void validateUniqueEmail(String email, Long currentId) {
        userRepository.findByEmailIgnoreCase(normalizeEmail(email))
                .filter(user -> !user.getId().equals(currentId))
                .ifPresent(user -> {
                    throw new IllegalArgumentException(
                            "El correo electrónico ya está registrado"
                    );
                });
    }

    private String normalizeUsername(String username) {
        return username.trim().toLowerCase();
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private UserResponse toResponse(User user) {
        Set<RoleResponse> roles = user.getRoles()
                .stream()
                .map(role -> new RoleResponse(
                        role.getId(),
                        role.getCode(),
                        role.getName(),
                        role.getDescription(),
                        role.getActive()
                ))
                .collect(Collectors.toSet());

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getActive(),
                user.getLocked(),
                roles,
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}