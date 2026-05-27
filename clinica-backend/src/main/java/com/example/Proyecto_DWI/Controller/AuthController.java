package com.example.Proyecto_DWI.Controller;

import com.example.Proyecto_DWI.Dto.LoginRequest;
import com.example.Proyecto_DWI.Dto.AuthResponse;
import com.example.Proyecto_DWI.Security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            // 1. Intentar autenticar contra el manejador de seguridad
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // 2. Si pasa, cargar los detalles del usuario y generar token
            final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
            final String jwt = jwtUtil.generateToken(userDetails);

            // Extraer el rol limpio (quitando el prefijo ROLE_)
            String rol = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .filter(auth -> auth.startsWith("ROLE_"))
                    .map(auth -> auth.replace("ROLE_", ""))
                    .findFirst()
                    .orElse("MEDICO");

            // Extraer la lista de permisos dinámicos
            List<String> permisos = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .filter(auth -> !auth.startsWith("ROLE_"))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(jwt)
                    .username(userDetails.getUsername())
                    .rol(rol)
                    .permisos(permisos)
                    .build());

        } catch (BadCredentialsException e) {
            // Imprime en la consola de Spring Boot para confirmar el fallo de contraseña
            System.out.println("❌ ERROR DE AUTENTICACIÓN: Contraseña o usuario incorrectos para: " + request.getUsername());
            
            Map<String, String> errorBody = new HashMap<>();
            errorBody.put("error", "Unauthorized");
            errorBody.put("message", "Usuario o contraseña incorrectos.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorBody);
            
        } catch (Exception e) {
            // Captura cualquier otro error inesperado (como nulos o mapeos)
            System.out.println("❌ ERROR INESPERADO EN LOGIN: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> errorBody = new HashMap<>();
            errorBody.put("error", "Internal Server Error");
            errorBody.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorBody);
        }
    }

}
