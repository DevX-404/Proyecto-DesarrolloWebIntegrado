package com.example.Proyecto_DWI.Service;

import com.example.Proyecto_DWI.Model.CitaMedica;
import com.example.Proyecto_DWI.Model.CitaMedica.EstadoCita;
import com.example.Proyecto_DWI.Repository.CitaMedicaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CitaMedicaService {

    private final CitaMedicaRepository citaMedicaRepository;

    public List<CitaMedica> listarTodas() {
        return citaMedicaRepository.findAll();
    }

    public CitaMedica buscarPorId(Long id) {
        return citaMedicaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));
    }

    // Validación solicitada en la rúbrica
    public boolean validarDisponibilidad(Long medicoId, LocalDateTime fechaCita) {
        return citaMedicaRepository.findAll().stream()
                .noneMatch(c -> c.getMedico().getId().equals(medicoId) && c.getFechaCita().equals(fechaCita));
    }

    public CitaMedica guardar(CitaMedica cita) {
        return citaMedicaRepository.save(cita);
    }

    public CitaMedica actualizar(Long id, CitaMedica cita) {
        CitaMedica existente = buscarPorId(id);
        existente.setMedico(cita.getMedico());
        existente.setPaciente(cita.getPaciente());
        existente.setFechaCita(cita.getFechaCita());
        existente.setMotivo(cita.getMotivo());
        existente.setEstado(cita.getEstado());
        return citaMedicaRepository.save(existente);
    }

    public void cancelarCita(Long id) {
        CitaMedica cita = buscarPorId(id);
        cita.setEstado(EstadoCita.CANCELADA);
        citaMedicaRepository.save(cita);
    }

    // Métodos analíticos para el Dashboard
    public long contarCitasTotales() {
        return citaMedicaRepository.count();
    }

    public List<CitaMedica> obtenerCitasDeHoy() {
        LocalDateTime inicio = LocalDate.now().atStartOfDay();
        LocalDateTime fin = LocalDate.now().atTime(LocalTime.MAX);
        return citaMedicaRepository.findAll().stream()
                .filter(c -> c.getFechaCita() != null && c.getFechaCita().isAfter(inicio)
                        && c.getFechaCita().isBefore(fin))
                .toList();
    }

    // Agrega esto dentro de tu CitaMedicaService.java
    public List<CitaMedica> listarPorMedico(Long medicoId) {
        // Retorna todas las citas asociadas a un médico en específico
        return citaMedicaRepository.findAll().stream()
                .filter(c -> c.getMedico().getId().equals(medicoId))
                .collect(java.util.stream.Collectors.toList());
    }

}
