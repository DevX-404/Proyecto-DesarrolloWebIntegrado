package com.example.Proyecto_DWI.Security;

import com.example.Proyecto_DWI.Model.Usuario;
import com.example.Proyecto_DWI.Repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        if (!usuario.isActivo()) {
            throw new RuntimeException("El usuario se encuentra inactivo");
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        
        authorities.add(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().getNombre()));

        if (usuario.getRol().getRolPermisos() != null) {
            usuario.getRol().getRolPermisos().forEach(rolPermiso -> {
                authorities.add(new SimpleGrantedAuthority(rolPermiso.getPermiso().getNombre()));
            });
        }

        return new User(usuario.getUsername(), usuario.getPassword(), authorities);
    }

}
