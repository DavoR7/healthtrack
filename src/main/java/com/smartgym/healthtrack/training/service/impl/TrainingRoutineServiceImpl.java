package com.smartgym.healthtrack.training.service.impl;

import com.smartgym.healthtrack.members.model.Member;
import com.smartgym.healthtrack.members.repository.MemberRepository;
import com.smartgym.healthtrack.training.dto.RoutineExerciseRequest;
import com.smartgym.healthtrack.training.dto.RoutineExerciseResponse;
import com.smartgym.healthtrack.training.dto.TrainingRoutineRequest;
import com.smartgym.healthtrack.training.dto.TrainingRoutineResponse;
import com.smartgym.healthtrack.training.model.RoutineExercise;
import com.smartgym.healthtrack.training.model.TrainingRoutine;
import com.smartgym.healthtrack.training.repository.TrainingRoutineRepository;
import com.smartgym.healthtrack.training.service.TrainingRoutineService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class TrainingRoutineServiceImpl
        implements TrainingRoutineService {

    private final TrainingRoutineRepository routineRepository;
    private final MemberRepository memberRepository;

    public TrainingRoutineServiceImpl(
            TrainingRoutineRepository routineRepository,
            MemberRepository memberRepository
    ) {
        this.routineRepository = routineRepository;
        this.memberRepository = memberRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrainingRoutineResponse> findAll(Boolean active) {
        List<TrainingRoutine> routines = active == null
                ? routineRepository.findAllByOrderByStartDateDesc()
                : routineRepository.findByActiveOrderByStartDateDesc(active);

        return routines.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrainingRoutineResponse> findByMemberId(
            Long memberId,
            Boolean active
    ) {
        findMemberById(memberId);

        List<TrainingRoutine> routines = active == null
                ? routineRepository
                    .findByMemberIdOrderByStartDateDesc(memberId)
                : routineRepository
                    .findByMemberIdAndActiveOrderByStartDateDesc(
                            memberId,
                            active
                    );

        return routines.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TrainingRoutineResponse findById(Long id) {
        return toResponse(findEntityById(id));
    }

    @Override
    public TrainingRoutineResponse create(
            TrainingRoutineRequest request
    ) {
        Member member = findMemberById(request.memberId());

        validateDates(
                request.startDate(),
                request.endDate()
        );

        TrainingRoutine routine = new TrainingRoutine();
        routine.setMember(member);

        applyRequest(routine, request);
        replaceExercises(routine, request.exercises());

        TrainingRoutine saved =
                routineRepository.save(routine);

        return toResponse(saved);
    }

    @Override
    public TrainingRoutineResponse update(
            Long id,
            TrainingRoutineRequest request
    ) {
        TrainingRoutine routine = findEntityById(id);
        Member member = findMemberById(request.memberId());

        validateDates(
                request.startDate(),
                request.endDate()
        );

        routine.setMember(member);
        applyRequest(routine, request);
        replaceExercises(routine, request.exercises());

        TrainingRoutine updated =
                routineRepository.save(routine);

        return toResponse(updated);
    }

    @Override
    public void deactivate(Long id) {
        TrainingRoutine routine = findEntityById(id);
        routine.setActive(false);

        routineRepository.save(routine);
    }

    private TrainingRoutine findEntityById(Long id) {
        return routineRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No se encontró la rutina con ID: " + id
                        )
                );
    }

    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No se encontró el deportista con ID: "
                                        + memberId
                        )
                );
    }

    private void applyRequest(
            TrainingRoutine routine,
            TrainingRoutineRequest request
    ) {
        routine.setName(request.name().trim());

        routine.setObjective(
                normalizeOptional(request.objective())
        );

        routine.setLevel(
                normalizeOptional(request.level())
        );

        routine.setStartDate(
                request.startDate() == null
                        ? LocalDate.now()
                        : request.startDate()
        );

        routine.setEndDate(request.endDate());
        routine.setDaysPerWeek(request.daysPerWeek());

        routine.setEstimatedDurationMinutes(
                request.estimatedDurationMinutes()
        );

        routine.setObservations(
                normalizeOptional(request.observations())
        );

        if (request.active() != null) {
            routine.setActive(request.active());
        }
    }

    private void replaceExercises(
            TrainingRoutine routine,
            List<RoutineExerciseRequest> requests
    ) {
        routine.clearExercises();

        if (requests == null || requests.isEmpty()) {
            return;
        }

        int automaticOrder = 1;

        for (RoutineExerciseRequest request : requests) {
            RoutineExercise exercise = new RoutineExercise();

            exercise.setName(request.name().trim());

            exercise.setMuscleGroup(
                    normalizeOptional(request.muscleGroup())
            );

            exercise.setSetsCount(request.setsCount());

            exercise.setRepetitions(
                    normalizeOptional(request.repetitions())
            );

            exercise.setLoadKg(request.loadKg());
            exercise.setRestSeconds(request.restSeconds());

            exercise.setExerciseOrder(
                    request.exerciseOrder() == null
                            ? automaticOrder
                            : request.exerciseOrder()
            );

            exercise.setInstructions(
                    normalizeOptional(request.instructions())
            );

            exercise.setActive(
                    request.active() == null
                            || request.active()
            );

            routine.addExercise(exercise);
            automaticOrder++;
        }
    }

    private void validateDates(
            LocalDate startDate,
            LocalDate endDate
    ) {
        LocalDate effectiveStartDate = startDate == null
                ? LocalDate.now()
                : startDate;

        if (
                endDate != null
                && endDate.isBefore(effectiveStartDate)
        ) {
            throw new IllegalArgumentException(
                    "La fecha de finalización no puede ser "
                            + "anterior a la fecha de inicio"
            );
        }
    }

    private String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private TrainingRoutineResponse toResponse(
            TrainingRoutine routine
    ) {
        Member member = routine.getMember();

        List<RoutineExerciseResponse> exercises =
                routine.getExercises()
                        .stream()
                        .sorted(
                                Comparator.comparing(
                                        RoutineExercise::getExerciseOrder
                                )
                        )
                        .map(this::toExerciseResponse)
                        .toList();

        return new TrainingRoutineResponse(
                routine.getId(),
                member.getId(),
                member.getIdentification(),
                member.getFirstName()
                        + " "
                        + member.getLastName(),
                routine.getName(),
                routine.getObjective(),
                routine.getLevel(),
                routine.getStartDate(),
                routine.getEndDate(),
                routine.getDaysPerWeek(),
                routine.getEstimatedDurationMinutes(),
                routine.getObservations(),
                routine.getActive(),
                exercises.size(),
                exercises,
                routine.getCreatedAt(),
                routine.getUpdatedAt()
        );
    }

    private RoutineExerciseResponse toExerciseResponse(
            RoutineExercise exercise
    ) {
        return new RoutineExerciseResponse(
                exercise.getId(),
                exercise.getName(),
                exercise.getMuscleGroup(),
                exercise.getSetsCount(),
                exercise.getRepetitions(),
                exercise.getLoadKg(),
                exercise.getRestSeconds(),
                exercise.getExerciseOrder(),
                exercise.getInstructions(),
                exercise.getActive()
        );
    }
}
