import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Medico {
  id?: number;
  nombre: string;
  matricula: string;
  genero: string;
  especialidad: string;
  subEspecialidad?: string;
  consultorio: string;
  estado: string;
  activo: boolean;
  // Campos analíticos auxiliares simulados para la UI profesional
  pacientesHoy?: number;
  proximaCita?: string;
  detalleEstado?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/medicos';

  listar(): Observable<Medico[]> {
    return this.http.get<Medico[]>(this.apiUrl);
  }

  registrar(medico: Medico): Observable<Medico> {
    return this.http.post<Medico>(this.apiUrl, medico);
  }

  editar(id: number, medico: Medico): Observable<Medico> {
    return this.http.put<Medico>(`${this.apiUrl}/${id}`, medico);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}