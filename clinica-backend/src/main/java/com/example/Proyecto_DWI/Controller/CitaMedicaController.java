package com.example.Proyecto_DWI.Controller;

import com.example.Proyecto_DWI.Model.CitaMedica;
import com.example.Proyecto_DWI.Service.CitaMedicaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/citas")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class CitaMedicaController {

    private final CitaMedicaService citaMedicaService;

    @GetMapping
    public ResponseEntity<List<CitaMedica>> listarTodas() {
        return ResponseEntity.ok(citaMedicaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CitaMedica> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(citaMedicaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<?> crearCita(@Valid @RequestBody CitaMedica cita) {
        // REQUISITO: Validar disponibilidad básica antes de registrar en la BD
        boolean disponible = citaMedicaService.validarDisponibilidad(cita.getMedico().getId(), cita.getFechaCita());
        if (!disponible) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "El médico seleccionado no cuenta con disponibilidad en la fecha u hora indicada.");
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
        
        CitaMedica nuevaCita = citaMedicaService.guardar(cita);
        return new ResponseEntity<>(nuevaCita, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CitaMedica> actualizarCita(@PathVariable Long id, @Valid @RequestBody CitaMedica cita) {
        CitaMedica actualizada = citaMedicaService.actualizar(id, cita);
        return ResponseEntity.ok(actualizada);
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Map<String, String>> cancelarCita(@PathVariable Long id) {
        citaMedicaService.cancelarCita(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Cita médica cancelada con éxito");
        return ResponseEntity.ok(response);
    }

}
