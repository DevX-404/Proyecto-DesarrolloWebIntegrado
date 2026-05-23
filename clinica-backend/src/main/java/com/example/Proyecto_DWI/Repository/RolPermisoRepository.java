package com.example.Proyecto_DWI.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Proyecto_DWI.Model.Permiso;
import com.example.Proyecto_DWI.Model.RolPermiso;
import com.example.Proyecto_DWI.Model.Rol;

public interface RolPermisoRepository extends JpaRepository<RolPermiso, Long> {

    Optional<RolPermiso> findByRolAndPermiso(Rol rol, Permiso permiso);

}
