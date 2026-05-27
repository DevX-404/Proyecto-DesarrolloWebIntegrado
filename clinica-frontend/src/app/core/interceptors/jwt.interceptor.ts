import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // 1. Recuperar el token JWT guardado en el localStorage tras el login exitoso
  const token = localStorage.getItem('token');

  let authReq = req;

  // 2. Si el token existe, clonamos la petición e inyectamos la cabecera Authorization
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 3. Pasamos la petición modificada y vigilamos si el backend responde con un error de autenticación
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        console.warn('Sesión inválida o expirada. Redireccionando al login...');
        
        // Limpiamos los datos del localStorage de forma segura
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('rol');
        
        // Expulsamos al usuario a la pantalla de login
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};