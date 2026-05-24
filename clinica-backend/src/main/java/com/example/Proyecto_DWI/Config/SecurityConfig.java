package com.example.Proyecto_DWI.Config;

import com.example.Proyecto_DWI.Security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {}) // Mantiene el soporte CORS para comunicarse con Angular
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Sesión por token JWT
            .authorizeHttpRequests(auth -> auth
                // Endpoint público para que Angular pueda loguearse
                .requestMatchers("/api/auth/**").permitAll()
                
                // REQUISITO EXIGIDO: ADMIN tiene acceso total a la gestión de médicos
                .requestMatchers("/api/medicos/**").hasRole("ADMIN")
                
                // REQUISITO EXIGIDO: ADMIN y MEDICO pueden ver/interactuar con pacientes y citas
                .requestMatchers("/api/pacientes/**").hasAnyRole("ADMIN", "MEDICO")
                .requestMatchers("/api/citas/**").hasAnyRole("ADMIN", "MEDICO")
                .requestMatchers("/api/dashboard/**").hasAnyRole("ADMIN", "MEDICO")
                
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Encriptador profesional para guardar claves seguras
    }

}
