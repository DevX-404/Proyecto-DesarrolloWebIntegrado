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
  idCitaEdicion: number | null = null; // 🌟 Controla si estamos creando o editando
  private citaService = inject(CitaService);
  private pacienteService = inject(PacienteService);
  private medicoService = inject(MedicoService);

  citas: CitaMedica[] = [];
  pacientes: Paciente[] = [];
  medicos: Medico[] = [];

  pacienteId: number | null = null;
  medicoId: number | null = null;
  fechaCita: string = '';
  prioridadTriaje: string = 'MEDIA';
  motivo: string = '';

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

  // 🌟 MODIFICADO: Ahora este método decide si CREA o ACTUALIZA según idCitaEdicion
  agendar(): void {
    if (!this.pacienteId || !this.medicoId || !this.fechaCita || !this.motivo.trim()) {
      alert('Por favor complete todos los datos, incluyendo el motivo de la consulta.');
      return;
    }

    const citaPayload: CitaMedica = {
      id: this.idCitaEdicion || undefined, // Si estamos editando, le mandamos su ID
      paciente: { id: this.pacienteId },
      medico: { id: this.medicoId },
      fechaCita: this.fechaCita,
      prioridadTriaje: this.prioridadTriaje,
      motivo: this.motivo
    };

    if (this.idCitaEdicion) {
      // 🚀 MODO EDICIÓN: Llama al servicio de actualizar
      this.citaService.actualizarCita(this.idCitaEdicion, citaPayload).subscribe({
        next: () => {
          this.cargarCitas();
          this.limpiarForm();
          alert('¡Cita modificada con éxito!');
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400 && err.error?.error) {
            alert(err.error.error); 
          } else {
            alert('Error de validación al actualizar la cita.');
          }
        }
      });
    } else {
      // 🚀 MODO CREACIÓN: Llama al flujo que ya tenías
      this.citaService.crear(citaPayload).subscribe({
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
  }

  // 🌟 NUEVO MÉTODO: Carga los datos de la fila de la tabla directo al formulario superior
  seleccionarParaEditar(cita: CitaMedica): void {
    if (cita.estado === 'CANCELADA') {
      alert('No se puede modificar una cita que ya fue cancelada.');
      return;
    }
    this.idCitaEdicion = cita.id || null;
    this.pacienteId = cita.paciente?.id || null;
    this.medicoId = cita.medico?.id || null;
    this.fechaCita = cita.fechaCita ? cita.fechaCita.substring(0, 16) : ''; // Formatea la fecha para el input datetime-local
    this.prioridadTriaje = cita.prioridadTriaje || 'MEDIA';
    this.motivo = cita.motivo || '';
  }

  cancelar(id?: number): void {
    if (id && confirm('¿Desea cancelar esta cita médica?')) {
      this.citaService.cancelar(id).subscribe({
        next: () => {
          this.cargarCitas();
          if (this.idCitaEdicion === id) this.limpiarForm(); // Por si la estabas editando justo antes
        },
        error: (err: any) => console.error('Error al cancelar cita', err)
      });
    }
  }

  // 🌟 MODIFICADO: Reinicia también el id de edición para volver a modo "Crear"
  limpiarForm(): void {
    this.idCitaEdicion = null;
    this.pacienteId = null;
    this.medicoId = null;
    this.fechaCita = '';
    this.prioridadTriaje = 'MEDIA';
    this.motivo = '';
  }
}