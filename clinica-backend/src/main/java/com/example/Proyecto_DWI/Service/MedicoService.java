package com.example.Proyecto_DWI.Service;

import com.example.Proyecto_DWI.Model.Medico;
import com.example.Proyecto_DWI.Repository.MedicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicoService {
    private final MedicoRepository medicoRepository;

    public List<Medico> listarTodos() {
        return medicoRepository.findAll();
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
        existente.setApellido(medico.getApellido());
        existente.setEspecialidad(medico.getEspecialidad());
        existente.setCmp(medico.getCmp());
        return medicoRepository.save(existente);
    }

    public void eliminar(Long id) {
        medicoRepository.deleteById(id);
    }

    // Método analítico para el Dashboard
    public long contarMedicosActivos() {
        return medicoRepository.count();
    }
}
