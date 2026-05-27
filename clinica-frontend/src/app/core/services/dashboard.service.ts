import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definimos una interfaz para tipar con precisión la respuesta JSON del backend
export interface DashboardMetrics {
  totalPacientes: number;
  totalMedicos: number;
  totalCitasProgramadas: number;
  citasHoy: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/dashboard';

  // Método para obtener las métricas requeridas en la consigna
  getMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.apiUrl}/metrics`);
  }
}