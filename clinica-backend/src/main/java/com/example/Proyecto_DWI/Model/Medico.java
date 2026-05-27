package com.example.Proyecto_DWI.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "medicos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Medico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre completo es obligatorio")
    private String nombre; // Recibe "Dr. Carlos Mendoza"

    @NotBlank(message = "La matrícula es obligatoria")
    @Column(unique = true, length = 20)
    private String matricula; // Reemplaza al viejo CMP para alinearse al HTML

    private String genero; // "M" o "F"

    @NotBlank(message = "La especialidad es obligatoria")
    private String especialidad;

    private String subEspecialidad;

    @NotBlank(message = "El consultorio es obligatorio")
    private String consultorio;

    private String estado; // "Activo", "En Consulta", "En Guardia", "De Baja"

    @Builder.Default
    private Boolean activo = true;

    @Transient
    private Long pacientesHoy = 0L;

    @Transient
    private String proximaCita = "—";

    @OneToOne(mappedBy = "medico", fetch = FetchType.LAZY)
    @JsonIgnore
    private Usuario usuario;

}
