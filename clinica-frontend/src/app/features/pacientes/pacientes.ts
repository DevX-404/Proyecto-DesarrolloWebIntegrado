import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PacienteService, Paciente } from '../../core/services/paciente.service';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.html'
})
export class PacientesComponent implements OnInit {
  private pacienteService = inject(PacienteService);

  pacientes: Paciente[] = [];
  
  // Variables de control de interfaz de usuario (UI)
  verInactivos: boolean = false;
  mostrarFiltros: boolean = false;
  mostrarMenuExportar: boolean = false;
  mostrarModal: boolean = false;
  esEdicion: boolean = false;
  mostrarHistorial: boolean = false;

  // Objetos enlazados a los modales del formulario e historial
  nuevoPaciente: Paciente = this.limpiarForm();
  pacienteSeleccionadoHistorial: Paciente | null = null;

  ngOnInit(): void {
    this.cargarPacientes();
  }

  limpiarForm(): Paciente {
    return {
      nombre: '',
      dni: '',
      edad: '',
      tipoEdad: 'Años',
      genero: 'M',
      triaje: 'Estable',
      alergias: '',
      antecedentes: '',
      celular: '',
      direccion: '',
      activo: true
    };
  }

  cargarPacientes(): void {
    this.pacienteService.listar().subscribe({
      next: (data: Paciente[]) => this.pacientes = data,
      error: (err: any) => console.error('Error al obtener la lista de pacientes:', err)
    });
  }

  // Filtra en caliente la tabla dependiendo si se presionó "Ver Inactivos" o "Ver Admitidos"
  get pacientesFiltrados(): Paciente[] {
    return this.pacientes.filter(p => p.activo === !this.verInactivos);
  }

  abrirFormulario(): void {
    this.nuevoPaciente = this.limpiarForm();
    this.esEdicion = false;
    this.mostrarModal = true;
  }

  cerrarFormulario(): void {
    this.mostrarModal = false;
  }

  agregarPaciente(): void {
    if (this.esEdicion && this.nuevoPaciente.id) {
      this.pacienteService.editar(this.nuevoPaciente.id, this.nuevoPaciente).subscribe({
        next: () => {
          this.cargarPacientes();
          this.cerrarFormulario();
          alert('Expediente de paciente actualizado.');
        },
        error: (err: any) => alert('Error al editar paciente.')
      });
    } else {
      this.pacienteService.registrar(this.nuevoPaciente).subscribe({
        next: () => {
          this.cargarPacientes();
          this.cerrarFormulario();
          alert('Paciente admitido correctamente.');
        },
        error: (err: any) => alert('Error al registrar la admisión.')
      });
    }
  }

  editarPaciente(paciente: Paciente, index: number): void {
    this.nuevoPaciente = { ...paciente };
    this.esEdicion = true;
    this.mostrarModal = true;
  }

  // Maneja la baja lógica o reactivación del paciente actualizando el estado 'activo'
  cambiarEstadoPaciente(paciente: Paciente): void {
    const nuevoEstado = !paciente.activo;
    const mensaje = nuevoEstado ? '¿Desea reactivar a este paciente?' : '¿Desea dar de baja a este paciente del sistema?';
    
    if (confirm(mensaje)) {
      const pacienteModificado = { ...paciente, activo: nuevoEstado };
      if (paciente.id) {
        this.pacienteService.editar(paciente.id, pacienteModificado).subscribe({
          next: () => this.cargarPacientes(),
          error: (err: any) => console.error(err)
        });
      }
    }
  }

  verHistorialClinico(paciente: Paciente): void {
    this.pacienteSeleccionadoHistorial = paciente;
    this.mostrarHistorial = true;
  }

  cerrarHistorial(): void {
    this.mostrarHistorial = false;
    this.pacienteSeleccionadoHistorial = null;
  }
}