package com.example.Proyecto_DWI.Service;

import com.example.Proyecto_DWI.Model.Paciente;
import com.example.Proyecto_DWI.Repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    public List<Paciente> listarTodos() {
        return pacienteRepository.findAll();
    }

    public Paciente buscarPorId(Long id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
    }

    public Paciente guardar(Paciente paciente) {
        return pacienteRepository.save(paciente);
    }

    public Paciente actualizar(Long id, Paciente paciente) {
        Paciente existente = buscarPorId(id);
        existente.setNombre(paciente.getNombre());
        existente.setDni(paciente.getDni());
        existente.setEdad(paciente.getEdad());
        existente.setTipoEdad(paciente.getTipoEdad());
        existente.setGenero(paciente.getGenero());
        existente.setTriaje(paciente.getTriaje());
        existente.setAlergias(paciente.getAlergias());
        existente.setAntecedentes(paciente.getAntecedentes());
        existente.setCelular(paciente.getCelular());
        existente.setDireccion(paciente.getDireccion());
        existente.setActivo(paciente.getActivo()); 
        return pacienteRepository.save(existente);
    }

    public void eliminar(Long id) {
        pacienteRepository.deleteById(id);
    }

    public long contarPacientesActivos() {
        return pacienteRepository.count(); 
    }

}
