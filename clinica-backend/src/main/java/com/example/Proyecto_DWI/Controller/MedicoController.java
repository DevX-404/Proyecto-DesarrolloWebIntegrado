package com.example.Proyecto_DWI.Controller;

import com.example.Proyecto_DWI.Model.Medico;
import com.example.Proyecto_DWI.Service.MedicoService;
import com.example.Proyecto_DWI.Repository.MedicoRepository; 
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/medicos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MedicoController {
    
    private final MedicoService medicoService;
    private final MedicoRepository medicoRepository; 

    @GetMapping
    public ResponseEntity<List<Medico>> listarTodos() {
        return ResponseEntity.ok(medicoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medico> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(medicoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Medico> registrar(@Valid @RequestBody Medico medico) {

        String estadoOriginal = (medico.getEstado() != null && !medico.getEstado().trim().isEmpty()) 
                                ? medico.getEstado() : "Activo";
        
        Medico nuevoMedico = medicoService.guardar(medico);
        
        nuevoMedico.setEstado(estadoOriginal);
        Medico medicoAsegurado = medicoRepository.save(nuevoMedico);
        
        return new ResponseEntity<>(medicoAsegurado, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medico> editar(@PathVariable Long id, @Valid @RequestBody Medico medico) {
        // 1. Capturamos el estado enviado desde el formulario de edición
        String estadoOriginal = (medico.getEstado() != null && !medico.getEstado().trim().isEmpty()) 
                                ? medico.getEstado() : "Activo";
 
        Medico actualizado = medicoService.actualizar(id, medico);

        actualizado.setEstado(estadoOriginal);
        Medico medicoEditadoAsegurado = medicoRepository.save(actualizado);
        
        return ResponseEntity.ok(medicoEditadoAsegurado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> eliminar(@PathVariable Long id) {
        medicoService.eliminar(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Médico eliminado correctamente");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/filtrar")
    public ResponseEntity<List<Medico>> filtrar(
            @RequestParam(required = false) String especialidad,
            @RequestParam(required = false) String estado) {
        
        String esp = (especialidad != null && !especialidad.isEmpty()) ? especialidad : null;
        String est = (estado != null && !estado.isEmpty()) ? estado : null;
        
        // Al llamar a listarTodos(), ahora sí vendrán los estados reales grabados a fuego en MySQL
        List<Medico> medicosFiltrados = medicoService.listarTodos().stream()
                .filter(m -> (esp == null || m.getEspecialidad().equalsIgnoreCase(esp)) &&
                             (est == null || m.getEstado().equalsIgnoreCase(est)))
                .toList();
                
        return ResponseEntity.ok(medicosFiltrados);
    }
}