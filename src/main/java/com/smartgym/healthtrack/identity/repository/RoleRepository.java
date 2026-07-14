package com.smartgym.healthtrack.identity.repository;

import com.smartgym.healthtrack.identity.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    List<Role> findAllByOrderByNameAsc();

    Optional<Role> findByCode(String code);

    boolean existsByCode(String code);
}