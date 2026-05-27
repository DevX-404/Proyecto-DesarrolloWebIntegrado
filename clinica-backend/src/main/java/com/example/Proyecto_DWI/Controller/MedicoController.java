package com.example.Proyecto_DWI.Controller;

import com.example.Proyecto_DWI.Model.Medico;
import com.example.Proyecto_DWI.Service.MedicoService;
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
@RequiredArgsConstructor
public class MedicoController {
    private final MedicoService medicoService;

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
        Medico nuevoMedico = medicoService.guardar(medico);
        return new ResponseEntity<>(nuevoMedico, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medico> editar(@PathVariable Long id, @Valid @RequestBody Medico medico) {
        Medico actualizado = medicoService.actualizar(id, medico);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> eliminar(@PathVariable Long id) {
        medicoService.eliminar(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Médico eliminado correctamente");
        return ResponseEntity.ok(response);
    }
}