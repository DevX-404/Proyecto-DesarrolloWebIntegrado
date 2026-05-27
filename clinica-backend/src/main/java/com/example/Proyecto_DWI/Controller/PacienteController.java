package com.example.Proyecto_DWI.Controller;

import com.example.Proyecto_DWI.Model.Paciente;
import com.example.Proyecto_DWI.Model.Usuario;
import com.example.Proyecto_DWI.Repository.UsuarioRepository;
import com.example.Proyecto_DWI.Service.PacienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pacientes")
@RequiredArgsConstructor
public class PacienteController {

    private final PacienteService pacienteService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<Paciente>> listarTodos(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        
        Usuario usuario = usuarioRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        String rol = usuario.getRol().getNombre();
        Long medicoId = (usuario.getMedico() != null) ? usuario.getMedico().getId() : null;
        
        return ResponseEntity.ok(pacienteService.listarPorRol(rol, medicoId));
    }

    // Obtener un paciente por ID
    @GetMapping("/{id}")
    public ResponseEntity<Paciente> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pacienteService.buscarPorId(id));
    }

    // Registrar un nuevo paciente (Uso de jakarta.validation)
    @PostMapping
    public ResponseEntity<Paciente> registrar(@Valid @RequestBody Paciente paciente) {
        Paciente nuevoPaciente = pacienteService.guardar(paciente);
        return new ResponseEntity<>(nuevoPaciente, HttpStatus.CREATED);
    }

    // Editar un paciente existente
    @PutMapping("/{id}")
    public ResponseEntity<Paciente> editar(@PathVariable Long id, @Valid @RequestBody Paciente paciente) {
        Paciente actualizado = pacienteService.actualizar(id, paciente);
        return ResponseEntity.ok(actualizado);
    }

    // Eliminar un paciente
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> eliminar(@PathVariable Long id) {
        pacienteService.eliminar(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Paciente eliminado correctamente");
        return ResponseEntity.ok(response);
    }
}
