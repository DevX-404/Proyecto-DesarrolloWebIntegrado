package com.example.Proyecto_DWI.Service;

import com.example.Proyecto_DWI.Model.Medico;
import com.example.Proyecto_DWI.Repository.CitaMedicaRepository;
import com.example.Proyecto_DWI.Repository.MedicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MedicoService {
    private final MedicoRepository medicoRepository;

    private final CitaMedicaRepository citaMedicaRepository;

    public List<Medico> listarTodos() {
    List<Medico> medicos = medicoRepository.findAll();
    LocalDateTime ahora = LocalDateTime.now();
    LocalDateTime inicioDia = ahora.with(java.time.LocalTime.MIN);
    LocalDateTime finDia = ahora.with(java.time.LocalTime.MAX);
    LocalDateTime limiteInferior = ahora.minusMinutes(30); // Ventana de consulta activa
    java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("HH:mm 'hs'");

    for (Medico medico : medicos) {
        if (Boolean.TRUE.equals(medico.getActivo())) {
            // 1. Cargar número real de pacientes asignados hoy
            long hoy = citaMedicaRepository.countCitasDeHoy(medico.getId(), inicioDia, finDia);
            medico.setPacientesHoy(hoy);

            // 2. Calcular la hora de su próxima cita pendiente
            Optional<LocalDateTime> proxima = citaMedicaRepository.findProximaCita(medico.getId(), ahora);
            if (proxima.isPresent()) {
                medico.setProximaCita(proxima.get().format(formatter));
            } else {
                medico.setProximaCita("Sin citas");
            }

            // 3. Automatización de Disponibilidad en tiempo real
            boolean enConsulta = citaMedicaRepository.tieneCitaEnCurso(medico.getId(), ahora, limiteInferior);
            if (enConsulta) {
                medico.setEstado("En Consulta");
            } else {
                medico.setEstado("Activo");
            }
        }
    }
    return medicos;
}

    public Medico buscarPorId(Long id) {
        return medicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Médico no encontrado"));
    }

    public Medico guardar(Medico medico) {
        return medicoRepository.save(medico);
    }

    public Medico actualizar(Long id, Medico medico) {
        Medico existente = buscarPorId(id);
        existente.setNombre(medico.getNombre());
        existente.setEspecialidad(medico.getEspecialidad());
        existente.setSubEspecialidad(medico.getSubEspecialidad());
        existente.setConsultorio(medico.getConsultorio());
        existente.setEstado(medico.getEstado());
        existente.setActivo(medico.getActivo());
        return medicoRepository.save(existente);
    }

    public void eliminar(Long id) {
        medicoRepository.deleteById(id);
    }

    public long contarMedicosActivos() {
        return medicoRepository.count();
    }

    public List<Medico> filtrarMedicos(String esp, String est) {
        throw new UnsupportedOperationException("Unimplemented method 'filtrarMedicos'");
    }

}
