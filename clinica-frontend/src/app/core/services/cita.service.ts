import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from './paciente.service';
import { Medico } from './medico.service';

export interface CitaMedica {
  id?: number;
  paciente: Partial<Paciente>;
  medico: Partial<Medico>;
  fechaCita: string;
  prioridadTriaje: string;
  motivo: string;
  estado?: string;
}

@Injectable({ providedIn: 'root' })
export class CitaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/citas';

  listar(): Observable<CitaMedica[]> { return this.http.get<CitaMedica[]>(this.apiUrl); }
  crear(cita: CitaMedica): Observable<any> { return this.http.post<any>(this.apiUrl, cita); }
  cancelar(id: number): Observable<any> { return this.http.put<any>(`${this.apiUrl}/${id}/cancelar`, {}); }
  listarPorMedico(medicoId: number): Observable<CitaMedica[]> {
    return this.http.get<CitaMedica[]>(`${this.apiUrl}/medico/${medicoId}`);
  }
}
