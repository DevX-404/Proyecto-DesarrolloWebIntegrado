import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { CitaService, CitaMedica } from '../../../core/services/cita.service';
import { PacienteService, Paciente } from '../../../core/services/paciente.service';
import { MedicoService, Medico } from '../../../core/services/medico.service';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.html'
})
export class CitasComponent implements OnInit {
  private citaService = inject(CitaService);
  private pacienteService = inject(PacienteService);
  private medicoService = inject(MedicoService);

  citas: CitaMedica[] = [];
  pacientes: Paciente[] = [];
  medicos: Medico[] = [];

  // Variables para enlazar al formulario con [(ngModel)]
  pacienteId: number | null = null;
  medicoId: number | null = null;
  fechaCita: string = '';
  prioridadTriaje: string = 'MEDIA';
  motivo: string = ''; // ✅ Añadido para cumplir con la validación de la BD

  ngOnInit(): void {
    this.cargarCitas();
    this.cargarSelectores();
  }

  cargarCitas(): void { 
    this.citaService.listar().subscribe({
      next: (data: CitaMedica[]) => this.citas = data,
      error: (err: any) => console.error('Error al cargar citas', err)
    }); 
  }

  cargarSelectores(): void {
    this.pacienteService.listar().subscribe({
      next: (data: Paciente[]) => this.pacientes = data.filter(p => p.activo),
      error: (err: any) => console.error('Error al cargar pacientes', err)
    });
    this.medicoService.listar().subscribe({
      next: (data: Medico[]) => this.medicos = data.filter(m => m.activo),
      error: (err: any) => console.error('Error al cargar médicos', err)
    });
  }

  agendar(): void {
    if (!this.pacienteId || !this.medicoId || !this.fechaCita || !this.motivo.trim()) {
      alert('Por favor complete todos los datos, incluyendo el motivo de la consulta.');
      return;
    }

    const nuevaCita: CitaMedica = {
      paciente: { id: this.pacienteId },
      medico: { id: this.medicoId },
      fechaCita: this.fechaCita,
      prioridadTriaje: this.prioridadTriaje,
      motivo: this.motivo
    };

    this.citaService.crear(nuevaCita).subscribe({
      next: () => {
        this.cargarCitas();
        this.limpiarForm();
        alert('¡Cita registrada con éxito!');
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400 && err.error?.error) {
          alert(err.error.error); 
        } else {
          alert('Error de validación al crear la cita.');
        }
      }
    });
  }

  cancelar(id?: number): void {
    if (id && confirm('¿Desea cancelar esta cita médica?')) {
      this.citaService.cancelar(id).subscribe({
        next: () => this.cargarCitas(),
        error: (err: any) => console.error('Error al cancelar cita', err)
      });
    }
  }

  limpiarForm(): void {
    this.pacienteId = null;
    this.medicoId = null;
    this.fechaCita = '';
    this.prioridadTriaje = 'MEDIA';
    this.motivo = '';
  }
}