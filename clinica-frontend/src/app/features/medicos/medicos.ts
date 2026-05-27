import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicoService, Medico } from '../../core/services/medico.service';

@Component({
  selector: 'app-medicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicos.html'
})
export class MedicosComponent implements OnInit {
  private medicoService = inject(MedicoService);

  medicos: Medico[] = [];
  
  // Variables de control de UI
  verInactivos: boolean = false;
  mostrarFiltros: boolean = false;
  mostrarMenuExportar: boolean = false;
  mostrarModal: boolean = false;
  esEdicion: boolean = false;

  nuevoMedico: Medico = this.limpiarForm();

  ngOnInit(): void {
    this.cargarMedicos();
  }

  limpiarForm(): Medico {
    return {
      nombre: '',
      matricula: '',
      genero: 'M',
      especialidad: 'Medicina Clínica',
      subEspecialidad: 'General',
      consultorio: 'Consultorio 05',
      estado: 'Activo',
      activo: true
    };
  }

  cargarMedicos(): void {
    this.medicoService.listar().subscribe({
      next: (data: Medico[]) => {
        // Enriquecemos la data con métricas auxiliares de presentación requeridas por el HTML
        this.medicos = data.map(m => ({
          ...m,
          pacientesHoy: m.pacientesHoy ?? Math.floor(Math.random() * 8) + 2,
          proximaCita: m.proximaCita ?? '15:30 hs',
          detalleEstado: m.detalleEstado ?? (m.estado === 'Activo' ? 'Disponible en piso' : 'Atendiendo Triaje')
        }));
      },
      error: (err: any) => console.error('Error al cargar médicos:', err)
    });
  }

  // Filtra en vivo la tabla según la pestaña activa (Activos vs Inactivos)
  get medicosFiltrados(): Medico[] {
    return this.medicos.filter(m => m.activo === !this.verInactivos);
  }

  abrirFormulario(): void {
    this.nuevoMedico = this.limpiarForm();
    // Generador automático profesional de matrícula para el campo readonly
    this.nuevoMedico.matricula = 'MED-' + Math.floor(10000 + Math.random() * 90000);
    this.esEdicion = false;
    this.mostrarModal = true;
  }

  cerrarFormulario(): void {
    this.mostrarModal = false;
  }

  agregarMedico(): void {
    if (this.esEdicion && this.nuevoMedico.id) {
      this.medicoService.editar(this.nuevoMedico.id, this.nuevoMedico).subscribe({
        next: () => {
          this.cargarMedicos();
          this.cerrarFormulario();
          alert('Datos del personal médico actualizados.');
        },
        error: (err: any) => alert('Error al actualizar médico.')
      });
    } else {
      this.medicoService.registrar(this.nuevoMedico).subscribe({
        next: () => {
          this.cargarMedicos();
          this.cerrarFormulario();
          alert('Nuevo médico registrado con éxito.');
        },
        error: (err: any) => alert('Error al guardar registro médico.')
      });
    }
  }

  editarMedico(medico: Medico): void {
    this.nuevoMedico = { ...medico };
    this.esEdicion = true;
    this.mostrarModal = true;
  }

  cambiarEstadoMedico(medico: Medico): void {
    const nuevoEstado = !medico.activo;
    const confirmacion = nuevoEstado ? '¿Desea reactivar a este médico?' : '¿Desea dar de baja a este médico del servicio activo?';

    if (confirm(confirmacion)) {
      const medicoModificado = { 
        ...medico, 
        activo: nuevoEstado,
        estado: nuevoEstado ? 'Activo' : 'De Baja'
      };
      if (medico.id) {
        this.medicoService.editar(medico.id, medicoModificado).subscribe({
          next: () => this.cargarMedicos(),
          error: (err: any) => console.error(err)
        });
      }
    }
  }
}