package com.example.Proyecto_DWI.Util;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.Proyecto_DWI.Model.Permiso;
import com.example.Proyecto_DWI.Model.Rol;
import com.example.Proyecto_DWI.Model.RolPermiso;
import com.example.Proyecto_DWI.Model.Usuario;
import com.example.Proyecto_DWI.Repository.PermisoRepository;
import com.example.Proyecto_DWI.Repository.RolRepository;
import com.example.Proyecto_DWI.Repository.UsuarioRepository;
import com.example.Proyecto_DWI.Repository.RolPermisoRepository;
import java.util.Arrays;
import java.util.List;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PermisoRepository permisoRepository;
    private final RolPermisoRepository rolPermisoRepository; 

    @Override
    public void run(String... args) throws Exception {
        // 1. Crear permisos del sistema clínico si no existen
        if (permisoRepository.count() == 0) {
            List<Permiso> permisos = Arrays.asList(
                Permiso.builder().nombre("ACCESO_DASHBOARD").descripcion("Permite ver las métricas del panel principal").build(),
                Permiso.builder().nombre("GESTION_PACIENTES").descripcion("Acceso completo al CRUD de pacientes").build(),
                Permiso.builder().nombre("GESTION_MEDICOS").descripcion("Acceso completo al CRUD de médicos").build(),
                Permiso.builder().nombre("GESTION_CITAS").descripcion("Permite programar y cancelar citas médicas").build(),
                Permiso.builder().nombre("VER_CITAS_ASIGNADAS").descripcion("Restringe al médico a ver solo su agenda propia").build()
            );
            permisoRepository.saveAll(permisos);
        }

        // 2. Crear Roles Base
        if (rolRepository.count() == 0) {
            Rol adminRol = Rol.builder().nombre("ADMIN").activo(true).build();
            Rol medicoRol = Rol.builder().nombre("MEDICO").activo(true).build();
            rolRepository.saveAll(Arrays.asList(adminRol, medicoRol));

            // 3. Asignar Permisos Dinámicos (Estructura RBAC comercial de tu referencia)
            Permiso pDashboard = permisoRepository.findAll().stream().filter(p -> p.getNombre().equals("ACCESO_DASHBOARD")).findFirst().get();
            Permiso pPacientes = permisoRepository.findAll().stream().filter(p -> p.getNombre().equals("GESTION_PACIENTES")).findFirst().get();
            Permiso pMedicos = permisoRepository.findAll().stream().filter(p -> p.getNombre().equals("GESTION_MEDICOS")).findFirst().get();
            Permiso pCitas = permisoRepository.findAll().stream().filter(p -> p.getNombre().equals("GESTION_CITAS")).findFirst().get();
            Permiso pAsignadas = permisoRepository.findAll().stream().filter(p -> p.getNombre().equals("VER_CITAS_ASIGNADAS")).findFirst().get();

            // ADMIN tiene acceso a todo
            rolPermisoRepository.save(RolPermiso.builder().rol(adminRol).permiso(pDashboard).build());
            rolPermisoRepository.save(RolPermiso.builder().rol(adminRol).permiso(pPacientes).build());
            rolPermisoRepository.save(RolPermiso.builder().rol(adminRol).permiso(pMedicos).build());
            rolPermisoRepository.save(RolPermiso.builder().rol(adminRol).permiso(pCitas).build());

            // MEDICO solo ve dashboard, pacientes y sus citas asignadas
            rolPermisoRepository.save(RolPermiso.builder().rol(medicoRol).permiso(pDashboard).build());
            rolPermisoRepository.save(RolPermiso.builder().rol(medicoRol).permiso(pPacientes).build());
            rolPermisoRepository.save(RolPermiso.builder().rol(medicoRol).permiso(pAsignadas).build());
        }

        // 4. Crear el Usuario Administrador inicial por defecto
        if (usuarioRepository.count() == 0) {
            Rol adminRol = rolRepository.findByNombre("ADMIN").orElseThrow();
            
            Usuario adminUsuario = Usuario.builder()
                .username("admin")
                .password("$2a$10$vXbSmvMvO.6bHREt9bWvSuXGf8Vb7K6CgD9mGexR2h9E6p7K76zXy") // Contraseña "admin123" encriptada en BCrypt
                .rol(adminRol)
                .activo(true)
                .build();
                
            usuarioRepository.save(adminUsuario);
            System.out.println("====== DATA SEEDER CLÍNICO: Usuario 'admin' con clave 'admin123' creado con éxito ======");
        }
    }

}
