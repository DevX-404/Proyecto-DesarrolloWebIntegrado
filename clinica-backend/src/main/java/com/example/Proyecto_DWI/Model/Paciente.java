package com.example.Proyecto_DWI.Model;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pacientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Se requiere nombre completo")
    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(unique = true, length = 20)
    private String historia; // Código automático: HC-DNI

    @NotNull(message = "DNI es obligatorio")
    @Pattern(regexp = "\\d{8}", message = "El DNI debe ser exactamente 8 números")
    @Column(nullable = false, unique = true, length = 8)
    private String dni;

    private String edad;
    
    private String tipoEdad; // "Años" o "Meses"
    
    private String genero; // "M" o "F"
    
    private String triaje; // "Estable", "Observación", "Urgencia"

    @Column(columnDefinition = "TEXT")
    private String alergias;

    @Column(columnDefinition = "TEXT")
    private String antecedentes;

    private String celular;
    
    private String direccion;

    @Column(name = "fecha_registro", updatable = false)
    private LocalDate fechaRegistro;

    @Builder.Default
    private Boolean activo = true;

    @PrePersist
    public void prePersist() {
        this.fechaRegistro = LocalDate.now();
        if (this.historia == null || this.historia.isEmpty()) {
            this.historia = "HC-" + this.dni;
        }
    }

}
