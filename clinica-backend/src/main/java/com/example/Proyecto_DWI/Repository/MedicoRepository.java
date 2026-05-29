package com.example.Proyecto_DWI.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.Proyecto_DWI.Model.Medico;

@Repository
public interface MedicoRepository extends JpaRepository<Medico, Long> {

    @Query("SELECT m FROM Medico m WHERE " +
            "(:especialidad IS NULL OR m.especialidad = :especialidad) AND " +
            "(:estado IS NULL OR m.estado = :estado) AND m.activo = true")
    List<Medico> filtrarMedicos(
            @Param("especialidad") String especialidad,
            @Param("estado") String estado);
}