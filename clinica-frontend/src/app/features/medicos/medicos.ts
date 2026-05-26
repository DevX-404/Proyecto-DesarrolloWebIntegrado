import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicos.html',
  styleUrls: ['./medicos.scss']
  })
export class MedicosComponent {
  mostrarModal = false;
  mostrarFiltros = false;
  mostrarMenuExportar = false;
  verInactivos = false;

  esEdicion = false;
  indiceEdicion: number | null = null;

  nuevoMedico = {
    matricula: '',
    nombre: '',
    genero: 'M',
    especialidad: 'Medicina Clínica',
    subEspecialidad: 'General',
    estado: 'Activo',
    detalleEstado: 'Disponible',
    pacientesHoy: 0,
    proximaCita: '--:--',
    consultorio: 'Consultorio 01',
    activo: true
  };

  medicos = [
    { matricula: '12345', nombre: 'Carlos Mendoza R.', genero: 'M', especialidad: 'Cardiología', subEspecialidad: 'Cardio-onco', estado: 'Activo', detalleEstado: 'En Consulta A2', pacientesHoy: 2, proximaCita: '10:15', consultorio: 'Consultorio 11', activo: true },
    { matricula: '67890', nombre: 'Ana López Torres', genero: 'F', especialidad: 'Medicina Clínica', subEspecialidad: 'General', estado: 'En Consulta', detalleEstado: 'Fin a las 11:30', pacientesHoy: 5, proximaCita: '10:15', consultorio: 'Consultorio 05', activo: true },
    { matricula: '45123', nombre: 'Luis Torres Urbina', genero: 'M', especialidad: 'Neurología', subEspecialidad: 'Neuro-vascular', estado: 'En Guardia', detalleEstado: 'Hasta las 20:00', pacientesHoy: 13, proximaCita: '10:15', consultorio: 'Consultorio 10', activo: true }
  ];

  get medicosFiltrados() {
    return this.medicos.filter(m => m.activo === !this.verInactivos);
  }

  abrirFormulario() {
    this.esEdicion = false;
    this.indiceEdicion = null;
    const matriculaAleatoria = Math.floor(10000 + Math.random() * 90000).toString();
    this.nuevoMedico = {
      matricula: matriculaAleatoria,
      nombre: '',
      genero: 'M',
      especialidad: 'Medicina Clínica',
      subEspecialidad: 'General',
      estado: 'Activo',
      detalleEstado: 'Disponible',
      pacientesHoy: 0,
      proximaCita: '--:--',
      consultorio: 'Consultorio 01',
      activo: true
    };
    this.mostrarModal = true;
  }

  editarMedico(medicoSeleccionado: any) {
    this.esEdicion = true;
    this.indiceEdicion = this.medicos.findIndex(m => m.matricula === medicoSeleccionado.matricula);
    this.nuevoMedico = { ...medicoSeleccionado };
    this.mostrarModal = true;
  }

  cerrarFormulario() {
    this.mostrarModal = false;
  }

  cambiarEstadoMedico(medico: any) {
    const estadoActual = medico.activo;
    const accion = estadoActual ? 'dar de baja' : 'reactivar';
    
    Swal.fire({
      title: `¿Seguro de ${accion} al médico?`,
      text: estadoActual ? 'El médico se moverá a la lista de personal inactivo.' : 'El médico volverá a figurar en el personal activo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: estadoActual ? '#ef4444' : '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: estadoActual ? 'Sí, dar de baja' : 'Sí, reactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        medico.activo = !estadoActual;
        medico.estado = medico.activo ? 'Activo' : 'De Baja';
        medico.detalleEstado = medico.activo ? 'Disponible' : 'Inactivo';
        
        Swal.fire({
          title: estadoActual ? 'Médico Inactivo' : 'Médico Reactivado',
          icon: 'success',
          confirmButtonColor: '#2563eb',
          timer: 1500
        });
      }
    });
  }

  agregarMedico() {
    if (this.nuevoMedico.nombre && this.nuevoMedico.consultorio) {
      
      //  frontend limpio: No inventamos lógica de horarios.
      // Cuando guardes un médico, mandas el estado clínico que eligió la recepcionista.
      // El backend recibirá esto, procesará el horario en la base de datos y sobreescribirá 
      // la propiedad 'detalleEstado' con el texto real (ej. "Hasta las 20:00") en el GET.
      if (!this.esEdicion) {
        this.nuevoMedico.detalleEstado = ''; // Empieza limpio para que lo llene el servidor
      }

      if (this.esEdicion && this.indiceEdicion !== null) {
        this.medicos[this.indiceEdicion] = { ...this.nuevoMedico };
        this.mostrarModal = false;
        Swal.fire({ title: '¡Actualizado!', text: 'Los datos del médico fueron actualizados.', icon: 'success', confirmButtonColor: '#2563eb', timer: 2000 });
      } else {
        this.medicos.unshift({ ...this.nuevoMedico });
        this.mostrarModal = false;
        Swal.fire({ title: '¡Registro Exitoso!', text: 'Médico dado de alta en el sistema.', icon: 'success', confirmButtonColor: '#2563eb', timer: 2000 });
      }
    } else {
      Swal.fire({ title: '¡Oops!', text: 'Por favor, ingresa el nombre del médico.', icon: 'error', confirmButtonColor: '#6366f1' });
    }
  }
}