package com.example.Proyecto_DWI.Controller;

import com.example.Proyecto_DWI.Service.PacienteService;
import com.example.Proyecto_DWI.Service.MedicoService;
import com.example.Proyecto_DWI.Service.CitaMedicaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final PacienteService pacienteService;
    private final MedicoService medicoService;
    private final CitaMedicaService citaMedicaService;

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> obtenerMetricas() {
        Map<String, Object> metrics = new HashMap<>();
        
        metrics.put("totalPacientes", pacienteService.contarPacientesActivos());
        metrics.put("totalMedicos", medicoService.contarMedicosActivos());
        metrics.put("totalCitasProgramadas", citaMedicaService.contarCitasTotales());
        metrics.put("citasHoy", citaMedicaService.obtenerCitasDeHoy().size());

        return ResponseEntity.ok(metrics);
    }

}
