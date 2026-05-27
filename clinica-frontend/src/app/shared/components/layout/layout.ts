import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class LayoutComponent implements OnInit {
  private router = inject(Router);

  username: string = 'Usuario';
  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.obtenerDatosDeSesion();
    this.configurarMenuPorNombreUsuario();
  }

  obtenerDatosDeSesion(): void {
    const usuarioGuardado = localStorage.getItem('username');
    if (usuarioGuardado) {
      this.username = usuarioGuardado;
    }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        if (payload.sub) {
          this.username = payload.sub; 
        }
      } catch (e) {
        console.error('Error decodificando el token:', e);
      }
    }
  }

  configurarMenuPorNombreUsuario(): void {
    const iconDashboard = 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6';
    const iconPacientes = 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z';
    const iconMedicos = 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2';
    const iconCitas = 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z';

    const usuarioLimpio = this.username.toLowerCase().trim();

    if (usuarioLimpio === 'medico') {
      this.menuItems = [
        { label: 'Dashboard', route: '/dashboard', icon: iconDashboard },
        { label: 'Mis Pacientes', route: '/pacientes', icon: iconPacientes },
        { label: 'Mi Agenda Médica', route: '/mis-citas', icon: iconCitas }
      ];
    } else {
      this.menuItems = [
        { label: 'Dashboard', route: '/dashboard', icon: iconDashboard },
        { label: 'Pacientes', route: '/pacientes', icon: iconPacientes },
        { label: 'Médicos', route: '/medicos', icon: iconMedicos },
        { label: 'Gestión de Citas', route: '/citas', icon: iconCitas }
      ];
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}