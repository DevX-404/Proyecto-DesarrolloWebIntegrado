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

    @NotNull(message = "Se requiere nombre")
    @Column(nullable = false, length = 100)
    private String nombre;

    @NotNull(message = "Se requiere apellido")
    @Column(nullable = false, length = 100)
    private String apellido;

    @NotNull(message = "DNI es obligatorio")
    @Pattern(regexp = "\\d{8}", message = "El DNI debe ser exactamente 8 números")
    @Column(nullable = false, unique = true, length = 8)
    private String dni;

    @NotNull(message = "Se requiere el telefono")
    @Pattern(regexp = "^(9\\d{8})?$", message = "El teléfono debe empezar con 9 y tener 9 dígitos o quedar vacío")
    private String telefono;

    @NotNull(message = "El email es obligatorio")
    @Email(message = "Email no tiene formato correcto")
    @Column(unique = true)
    private String email;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento debe ser una fecha pasada")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @NotNull(message = "La fecha de alta es obligatoria")
    @Column(name = "fecha_registro", updatable = false)
    private LocalDate fechaRegistro;

    private boolean activo = true;

    @PrePersist
    public void prePersist() {
        this.fechaRegistro = LocalDate.now();
    }

}
