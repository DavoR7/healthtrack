package com.smartgym.healthtrack.trainingsession.service.impl;

import com.smartgym.healthtrack.members.model.Member;
import com.smartgym.healthtrack.members.repository.MemberRepository;
import com.smartgym.healthtrack.training.model.RoutineExercise;
import com.smartgym.healthtrack.training.model.TrainingRoutine;
import com.smartgym.healthtrack.training.repository.RoutineExerciseRepository;
import com.smartgym.healthtrack.training.repository.TrainingRoutineRepository;
import com.smartgym.healthtrack.trainingsession.dto.PerformedExerciseRequest;
import com.smartgym.healthtrack.trainingsession.dto.PerformedExerciseResponse;
import com.smartgym.healthtrack.trainingsession.dto.TrainingSessionRequest;
import com.smartgym.healthtrack.trainingsession.dto.TrainingSessionResponse;
import com.smartgym.healthtrack.trainingsession.model.ActivityType;
import com.smartgym.healthtrack.trainingsession.model.PerformedExercise;
import com.smartgym.healthtrack.trainingsession.model.TrainingSession;
import com.smartgym.healthtrack.trainingsession.repository.TrainingSessionRepository;
import com.smartgym.healthtrack.trainingsession.service.TrainingSessionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class TrainingSessionServiceImpl
        implements TrainingSessionService {

    private final TrainingSessionRepository sessionRepository;
    private final MemberRepository memberRepository;
    private final TrainingRoutineRepository routineRepository;
    private final RoutineExerciseRepository routineExerciseRepository;

    public TrainingSessionServiceImpl(
            TrainingSessionRepository sessionRepository,
            MemberRepository memberRepository,
            TrainingRoutineRepository routineRepository,
            RoutineExerciseRepository routineExerciseRepository
    ) {
        this.sessionRepository = sessionRepository;
        this.memberRepository = memberRepository;
        this.routineRepository = routineRepository;
        this.routineExerciseRepository =
                routineExerciseRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrainingSessionResponse> findAll(
            Boolean active
    ) {
        List<TrainingSession> sessions = active == null
                ? sessionRepository
                    .findAllByOrderBySessionDateDescStartTimeDesc()
                : sessionRepository
                    .findByActiveOrderBySessionDateDescStartTimeDesc(
                            active
                    );

        return sessions.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TrainingSessionResponse findById(
            Long id
    ) {
        return toResponse(
                findEntityById(id)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrainingSessionResponse> findByMemberId(
            Long memberId,
            Boolean active
    ) {
        findMemberById(memberId);

        List<TrainingSession> sessions = active == null
                ? sessionRepository
                    .findByMemberIdOrderBySessionDateDescStartTimeDesc(
                            memberId
                    )
                : sessionRepository
                    .findByMemberIdAndActiveOrderBySessionDateDescStartTimeDesc(
                            memberId,
                            active
                    );

        return sessions.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrainingSessionResponse> findByRoutineId(
            Long routineId,
            Boolean active
    ) {
        findRoutineById(routineId);

        List<TrainingSession> sessions = active == null
                ? sessionRepository
                    .findByRoutineIdOrderBySessionDateDescStartTimeDesc(
                            routineId
                    )
                : sessionRepository
                    .findByRoutineIdAndActiveOrderBySessionDateDescStartTimeDesc(
                            routineId,
                            active
                    );

        return sessions.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public TrainingSessionResponse create(
            TrainingSessionRequest request
    ) {
        Member member = findMemberById(
                request.memberId()
        );

        TrainingRoutine routine = resolveRoutine(
                request.routineId(),
                member.getId()
        );

        validateTimes(
                request.startTime(),
                request.endTime()
        );

        TrainingSession session = new TrainingSession();

        session.setMember(member);
        session.setRoutine(routine);

        applyRequest(session, request);

        replacePerformedExercises(
                session,
                routine,
                request.performedExercises()
        );

        TrainingSession saved =
                sessionRepository.save(session);

        return toResponse(saved);
    }

    @Override
    public TrainingSessionResponse update(
            Long id,
            TrainingSessionRequest request
    ) {
        TrainingSession session =
                findEntityById(id);

        Member member = findMemberById(
                request.memberId()
        );

        TrainingRoutine routine = resolveRoutine(
                request.routineId(),
                member.getId()
        );

        validateTimes(
                request.startTime(),
                request.endTime()
        );

        session.setMember(member);
        session.setRoutine(routine);

        applyRequest(session, request);

        replacePerformedExercises(
                session,
                routine,
                request.performedExercises()
        );

        TrainingSession updated =
                sessionRepository.save(session);

        return toResponse(updated);
    }

    @Override
    public void deactivate(
            Long id
    ) {
        TrainingSession session =
                findEntityById(id);

        session.setActive(false);

        sessionRepository.save(session);
    }

    private void applyRequest(
            TrainingSession session,
            TrainingSessionRequest request
    ) {
        session.setSessionDate(
                request.sessionDate() == null
                        ? LocalDate.now()
                        : request.sessionDate()
        );

        session.setStartTime(request.startTime());
        session.setEndTime(request.endTime());

        session.setActivityType(
                request.activityType() == null
                        ? ActivityType.FUERZA
                        : request.activityType()
        );

        session.setDurationMinutes(
                request.durationMinutes()
        );

        session.setSteps(request.steps());

        session.setDistanceKm(
                request.distanceKm()
        );

        session.setCardioMinutes(
                request.cardioMinutes()
        );

        session.setCaloriesBurned(
                request.caloriesBurned()
        );

        session.setFloorsClimbed(
                request.floorsClimbed()
        );

        session.setAverageHeartRate(
                request.averageHeartRate()
        );

        session.setMaximumHeartRate(
                request.maximumHeartRate()
        );

        session.setEffortLevel(
                request.effortLevel()
        );

        session.setPainLevel(
                request.painLevel()
        );

        session.setCompleted(
                request.completed() != null
                        && request.completed()
        );

        session.setActive(
                request.active() == null
                        || request.active()
        );

        session.setObservations(
                normalizeOptional(
                        request.observations()
                )
        );
    }

    private void replacePerformedExercises(
            TrainingSession session,
            TrainingRoutine routine,
            List<PerformedExerciseRequest> requests
    ) {
        session.clearPerformedExercises();

        if (requests == null || requests.isEmpty()) {
            return;
        }

        int automaticOrder = 1;

        for (PerformedExerciseRequest request : requests) {
            PerformedExercise performed =
                    new PerformedExercise();

            RoutineExercise routineExercise =
                    resolveRoutineExercise(
                            request.routineExerciseId(),
                            routine
                    );

            performed.setRoutineExercise(
                    routineExercise
            );

            performed.setExerciseName(
                    request.exerciseName().trim()
            );

            performed.setExerciseType(
                    normalizeOptional(
                            request.exerciseType()
                    )
            );

            performed.setSetsCompleted(
                    request.setsCompleted()
            );

            performed.setRepetitionsCompleted(
                    normalizeOptional(
                            request.repetitionsCompleted()
                    )
            );

            performed.setWeightKg(
                    request.weightKg()
            );

            performed.setDurationMinutes(
                    request.durationMinutes()
            );

            performed.setDistanceKm(
                    request.distanceKm()
            );

            performed.setCaloriesBurned(
                    request.caloriesBurned()
            );

            performed.setAverageHeartRate(
                    request.averageHeartRate()
            );

            performed.setEffortLevel(
                    request.effortLevel()
            );

            performed.setPainLevel(
                    request.painLevel()
            );

            performed.setCompleted(
                    request.completed() != null
                            && request.completed()
            );

            performed.setActive(
                    request.active() == null
                            || request.active()
            );

            performed.setObservations(
                    normalizeOptional(
                            request.observations()
                    )
            );

            performed.setExerciseOrder(
                    request.exerciseOrder() == null
                            ? automaticOrder
                            : request.exerciseOrder()
            );

            session.addPerformedExercise(performed);

            automaticOrder++;
        }
    }

    private TrainingSession findEntityById(
            Long id
    ) {
        return sessionRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No se encontró la sesión con ID: "
                                        + id
                        )
                );
    }

    private Member findMemberById(
            Long memberId
    ) {
        return memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No se encontró el deportista con ID: "
                                        + memberId
                        )
                );
    }

    private TrainingRoutine findRoutineById(
            Long routineId
    ) {
        return routineRepository.findById(routineId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No se encontró la rutina con ID: "
                                        + routineId
                        )
                );
    }

    private TrainingRoutine resolveRoutine(
            Long routineId,
            Long memberId
    ) {
        if (routineId == null) {
            return null;
        }

        TrainingRoutine routine =
                findRoutineById(routineId);

        if (
                !routine.getMember()
                        .getId()
                        .equals(memberId)
        ) {
            throw new IllegalArgumentException(
                    "La rutina seleccionada no pertenece "
                            + "al deportista indicado"
            );
        }

        return routine;
    }

    private RoutineExercise resolveRoutineExercise(
            Long routineExerciseId,
            TrainingRoutine routine
    ) {
        if (routineExerciseId == null) {
            return null;
        }

        RoutineExercise exercise =
                routineExerciseRepository
                        .findById(routineExerciseId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "No se encontró el ejercicio "
                                                + "prescrito con ID: "
                                                + routineExerciseId
                                )
                        );

        if (routine == null) {
            throw new IllegalArgumentException(
                    "No se puede relacionar un ejercicio "
                            + "prescrito sin seleccionar una rutina"
            );
        }

        if (
                !exercise.getRoutine()
                        .getId()
                        .equals(routine.getId())
        ) {
            throw new IllegalArgumentException(
                    "El ejercicio prescrito no pertenece "
                            + "a la rutina seleccionada"
            );
        }

        return exercise;
    }

    private void validateTimes(
            LocalTime startTime,
            LocalTime endTime
    ) {
        if (
                startTime != null
                && endTime != null
                && endTime.isBefore(startTime)
        ) {
            throw new IllegalArgumentException(
                    "La hora de finalización no puede ser "
                            + "anterior a la hora de inicio"
            );
        }
    }

    private String normalizeOptional(
            String value
    ) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private TrainingSessionResponse toResponse(
            TrainingSession session
    ) {
        Member member = session.getMember();
        TrainingRoutine routine = session.getRoutine();

        List<PerformedExerciseResponse> exercises =
                session.getPerformedExercises()
                        .stream()
                        .sorted(
                                Comparator.comparing(
                                        PerformedExercise::getExerciseOrder
                                )
                        )
                        .map(this::toPerformedExerciseResponse)
                        .toList();

        int completedExerciseCount = (int) exercises
                .stream()
                .filter(exercise ->
                        Boolean.TRUE.equals(
                                exercise.completed()
                        )
                )
                .count();

        BigDecimal completionPercentage =
                calculateCompletionPercentage(
                        exercises.size(),
                        completedExerciseCount
                );

        BigDecimal totalWeightVolume =
                calculateTotalWeightVolume(
                        exercises
                );

        return new TrainingSessionResponse(
                session.getId(),

                member.getId(),
                member.getIdentification(),
                member.getFirstName()
                        + " "
                        + member.getLastName(),

                routine == null
                        ? null
                        : routine.getId(),

                routine == null
                        ? null
                        : routine.getName(),

                session.getSessionDate(),
                session.getStartTime(),
                session.getEndTime(),
                session.getActivityType(),

                session.getDurationMinutes(),
                session.getSteps(),
                session.getDistanceKm(),
                session.getCardioMinutes(),
                session.getCaloriesBurned(),
                session.getFloorsClimbed(),

                session.getAverageHeartRate(),
                session.getMaximumHeartRate(),
                session.getEffortLevel(),
                session.getPainLevel(),

                session.getCompleted(),
                session.getActive(),
                session.getObservations(),

                exercises.size(),
                completedExerciseCount,
                completionPercentage,
                totalWeightVolume,

                exercises,

                session.getCreatedAt(),
                session.getUpdatedAt()
        );
    }

    private PerformedExerciseResponse
    toPerformedExerciseResponse(
            PerformedExercise performed
    ) {
        RoutineExercise routineExercise =
                performed.getRoutineExercise();

        return new PerformedExerciseResponse(
                performed.getId(),

                routineExercise == null
                        ? null
                        : routineExercise.getId(),

                performed.getExerciseName(),
                performed.getExerciseType(),
                performed.getSetsCompleted(),
                performed.getRepetitionsCompleted(),
                performed.getWeightKg(),
                performed.getDurationMinutes(),
                performed.getDistanceKm(),
                performed.getCaloriesBurned(),
                performed.getAverageHeartRate(),
                performed.getEffortLevel(),
                performed.getPainLevel(),
                performed.getCompleted(),
                performed.getActive(),
                performed.getObservations(),
                performed.getExerciseOrder(),
                performed.getCreatedAt(),
                performed.getUpdatedAt()
        );
    }

    private BigDecimal calculateCompletionPercentage(
            int exerciseCount,
            int completedExerciseCount
    ) {
        if (exerciseCount == 0) {
            return BigDecimal.ZERO
                    .setScale(2, RoundingMode.HALF_UP);
        }

        return BigDecimal
                .valueOf(completedExerciseCount)
                .multiply(BigDecimal.valueOf(100))
                .divide(
                        BigDecimal.valueOf(exerciseCount),
                        2,
                        RoundingMode.HALF_UP
                );
    }

    private BigDecimal calculateTotalWeightVolume(
            List<PerformedExerciseResponse> exercises
    ) {
        BigDecimal total = BigDecimal.ZERO;

        for (PerformedExerciseResponse exercise : exercises) {
            if (
                    exercise.weightKg() == null
                    || exercise.setsCompleted() == null
            ) {
                continue;
            }

            Integer repetitions =
                    extractNumericRepetitions(
                            exercise.repetitionsCompleted()
                    );

            if (repetitions == null) {
                continue;
            }

            BigDecimal exerciseVolume =
                    exercise.weightKg()
                            .multiply(
                                    BigDecimal.valueOf(
                                            exercise.setsCompleted()
                                    )
                            )
                            .multiply(
                                    BigDecimal.valueOf(
                                            repetitions
                                    )
                            );

            total = total.add(exerciseVolume);
        }

        return total.setScale(
                2,
                RoundingMode.HALF_UP
        );
    }

    private Integer extractNumericRepetitions(
            String repetitions
    ) {
        if (repetitions == null || repetitions.isBlank()) {
            return null;
        }

        String normalized = repetitions.trim();

        if (!normalized.matches("\\d+")) {
            return null;
        }

        return Integer.valueOf(normalized);
    }
}
