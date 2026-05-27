package com.example.Proyecto_DWI.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.Proyecto_DWI.Model.Paciente;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    @Query("SELECT p FROM Paciente p WHERE p.activo = true ORDER BY p.id DESC")
    List<Paciente> findAllPacientesActivosClasificados();

    Optional<Paciente> findByDni(String dni);

    List<Paciente> findByNombreContaining(String nombre);

    boolean existsByDni(String dni);

    List<Paciente> findByActivoTrue();

    List<Paciente> findByActivoFalse();

    List<Paciente> findByActivoTrueAndNombreContaining(String nombre);

    @Query("SELECT DISTINCT c.paciente FROM CitaMedica c WHERE c.medico.id = :medicoId")
    List<Paciente> findPacientesPorMedico(@Param("medicoId") Long medicoId);

}
