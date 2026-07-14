package com.smartgym.healthtrack.members.repository;

import com.smartgym.healthtrack.members.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByIdentification(String identification);

    boolean existsByIdentification(String identification);

    List<Member> findAllByOrderByLastNameAscFirstNameAsc();

    List<Member> findByActiveOrderByLastNameAscFirstNameAsc(Boolean active);
}