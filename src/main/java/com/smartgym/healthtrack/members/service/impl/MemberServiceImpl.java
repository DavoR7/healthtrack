package com.smartgym.healthtrack.members.service.impl;

import com.smartgym.healthtrack.members.dto.MemberRequest;
import com.smartgym.healthtrack.members.dto.MemberResponse;
import com.smartgym.healthtrack.members.model.Member;
import com.smartgym.healthtrack.members.repository.MemberRepository;
import com.smartgym.healthtrack.members.service.MemberService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
@Transactional
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;

    public MemberServiceImpl(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MemberResponse> findAll(Boolean active) {
        List<Member> members = active == null
                ? memberRepository.findAllByOrderByLastNameAscFirstNameAsc()
                : memberRepository.findByActiveOrderByLastNameAscFirstNameAsc(active);

        return members.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MemberResponse findById(Long id) {
        return toResponse(findEntityById(id));
    }

    @Override
    public MemberResponse create(MemberRequest request) {
        String identification = normalizeRequired(request.identification());

        if (memberRepository.existsByIdentification(identification)) {
            throw new IllegalArgumentException(
                    "Ya existe un deportista con la identificación: "
                            + identification
            );
        }

        Member member = new Member();
        applyRequest(member, request);
        member.setIdentification(identification);
        member.setActive(request.active() == null || request.active());

        return toResponse(memberRepository.save(member));
    }

    @Override
    public MemberResponse update(Long id, MemberRequest request) {
        Member member = findEntityById(id);
        String identification = normalizeRequired(request.identification());

        memberRepository.findByIdentification(identification)
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException(
                            "Ya existe otro deportista con esa identificación"
                    );
                });

        applyRequest(member, request);
        member.setIdentification(identification);

        if (request.active() != null) {
            member.setActive(request.active());
        }

        return toResponse(memberRepository.save(member));
    }

    @Override
    public void deactivate(Long id) {
        Member member = findEntityById(id);
        member.setActive(false);
        memberRepository.save(member);
    }

    private Member findEntityById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No se encontró el deportista con ID: " + id
                        )
                );
    }

    private void applyRequest(Member member, MemberRequest request) {
        member.setFirstName(normalizeRequired(request.firstName()));
        member.setLastName(normalizeRequired(request.lastName()));
        member.setGender(normalizeOptional(request.gender()));
        member.setBirthDate(request.birthDate());
        member.setEmail(normalizeEmail(request.email()));
        member.setPhone(normalizeOptional(request.phone()));
        member.setAddress(normalizeOptional(request.address()));
        member.setBloodType(normalizeUpper(request.bloodType()));
        member.setEmergencyContactName(
                normalizeOptional(request.emergencyContactName())
        );
        member.setEmergencyContactPhone(
                normalizeOptional(request.emergencyContactPhone())
        );
        member.setPhotoUrl(normalizeOptional(request.photoUrl()));
    }

    private MemberResponse toResponse(Member member) {
        String fullName = member.getFirstName()
                + " "
                + member.getLastName();

        return new MemberResponse(
                member.getId(),
                member.getIdentification(),
                member.getFirstName(),
                member.getLastName(),
                fullName,
                member.getGender(),
                member.getBirthDate(),
                calculateAge(member.getBirthDate()),
                member.getEmail(),
                member.getPhone(),
                member.getAddress(),
                member.getBloodType(),
                member.getEmergencyContactName(),
                member.getEmergencyContactPhone(),
                member.getPhotoUrl(),
                member.getActive(),
                member.getCreatedAt(),
                member.getUpdatedAt()
        );
    }

    private Integer calculateAge(LocalDate birthDate) {
        if (birthDate == null) {
            return null;
        }

        return Period.between(
                birthDate,
                LocalDate.now()
        ).getYears();
    }

    private String normalizeRequired(String value) {
        return value.trim();
    }

    private String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }

        return email.trim().toLowerCase();
    }

    private String normalizeUpper(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim().toUpperCase();
    }
}