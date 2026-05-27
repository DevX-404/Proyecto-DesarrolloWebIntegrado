package com.example.Proyecto_DWI.Repository;

import java.time.LocalDateTime;
import java.util.List;

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
}
