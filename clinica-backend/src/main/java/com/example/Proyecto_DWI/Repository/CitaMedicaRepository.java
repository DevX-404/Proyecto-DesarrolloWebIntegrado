package com.example.Proyecto_DWI.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.Proyecto_DWI.Model.CitaMedica;

@Repository
public interface CitaMedicaRepository extends JpaRepository<CitaMedica, Long> {

    @Query("SELECT c FROM CitaMedica c WHERE c.medico.id = :medicoId AND c.fechaCita BETWEEN :inicioDia AND :finDia AND c.estado != 'CANCELADA'")
    List<CitaMedica> findCitasDeHoyPorMedico(
            @Param("medicoId") Long medicoId,
            @Param("inicioDia") LocalDateTime inicioDia,
            @Param("finDia") LocalDateTime finDia);

    List<CitaMedica> findByPacienteId(Long pacienteId);

    List<CitaMedica> findByEstado(CitaMedica.EstadoCita estado);

    @Query("SELECT COUNT(c) > 0 FROM CitaMedica c WHERE c.fechaCita = :fecha AND c.medico.id = :medicoId AND c.estado != com.example.Proyecto_DWI.Model.CitaMedica.EstadoCita.CANCELADA")
    boolean existeConflictoMedico(@Param("fecha") LocalDateTime fecha, @Param("medicoId") Long medicoId);

    // 🌟 NUEVA CONSULTA JPQL: Cuenta cuántas citas activas tiene el médico asignadas el día de hoy
    @Query("SELECT COUNT(c) FROM CitaMedica c WHERE c.medico.id = :medicoId AND c.fechaCita BETWEEN :inicio AND :fin AND c.estado = com.example.Proyecto_DWI.Model.CitaMedica.EstadoCita.PENDIENTE")
    long countCitasDeHoy(@Param("medicoId") Long medicoId, @Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    // 🌟 NUEVA CONSULTA JPQL: Obtiene la fecha cronológica de la cita más cercana en el futuro
    @Query("SELECT MIN(c.fechaCita) FROM CitaMedica c WHERE c.medico.id = :medicoId AND c.fechaCita > :ahora AND c.estado = com.example.Proyecto_DWI.Model.CitaMedica.EstadoCita.PENDIENTE")
    Optional<LocalDateTime> findProximaCita(@Param("medicoId") Long medicoId, @Param("ahora") LocalDateTime ahora);

    // 🌟 NUEVA CONSULTA JPQL: Verifica si el médico tiene una cita en curso justo ahora (Margen de atención de 30 min)
    @Query("SELECT COUNT(c) > 0 FROM CitaMedica c WHERE c.medico.id = :medicoId AND c.fechaCita <= :ahora AND c.fechaCita >= :limiteInferior AND c.estado = com.example.Proyecto_DWI.Model.CitaMedica.EstadoCita.PENDIENTE")
    boolean tieneCitaEnCurso(@Param("medicoId") Long medicoId, @Param("ahora") LocalDateTime ahora, @Param("limiteInferior") LocalDateTime limiteInferior);
}
