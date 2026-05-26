import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { AuthService } from '../../../core/services/auth'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
 
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  username = '';
  password = '';
  errorMessage = ''; 

  onLogin() {
    this.errorMessage = '';

    const credenciales = {
      username: this.username,
      password: this.password
    };

    this.authService.login(credenciales).subscribe({
      next: (response: any) => {
        console.log('¡Login exitoso!', response);
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error('Error en el login:', err);
        this.errorMessage = 'Usuario o contraseña incorrectos. Inténtalo de nuevo.';
      }
    });
  }



}