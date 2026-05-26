import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.html',
  styleUrls: ['./pacientes.scss']
})
export class PacientesComponent {
  mostrarModal = false;
  mostrarFiltros = false;
  mostrarMenuExportar = false;
  
  mostrarHistorial = false;
  pacienteSeleccionadoHistorial: any = null;
  esEdicion = false;
  indiceEdicion: number | null = null;
  verInactivos = false;

  nuevoPaciente = {
    historia: '',
    dni: '',
    nombre: '',
    genero: 'M',
    edad: '',
    tipoEdad: 'Años',
    triaje: 'Estable',
    celular: '',
    direccion: '',
    email: '',
    ultimaVisita: '26/05/2026',
    alergias: '',
    antecedentes: '',
    notasMedicas: 'Paciente ingresado por admisión general.',
    activo: true
  };

  pacientes = [
    { 
      historia: 'HC-9421', dni: '74829104', nombre: 'Juan Pérez Silva', genero: 'M', edad: '42', tipoEdad: 'Años', triaje: 'Estable', celular: '987654321', direccion: 'Av. Larco 456', email: 'juan.perez@gmail.com', ultimaVisita: '20/05/2026',
      antecedentes: 'Hipertensión arterial controlada.', alergias: 'Penicilina', notasMedicas: 'Control anual de riesgo cardiovascular.', activo: true
    },
    { 
      historia: 'HC-8832', dni: '45928173', nombre: 'María Ramos Delgado', genero: 'F', edad: '28', tipoEdad: 'Años', triaje: 'Observación', celular: '951753852', direccion: 'Calle Balta 123', email: 'maria.ramos@outlook.com', ultimaVisita: '22/05/2026',
      antecedentes: 'Asma bronquial en la infancia.', alergias: 'Polen y ácaros', notasMedicas: 'Ingresa por cuadro de fatiga y dolor de cabeza.', activo: true
    },
    { 
      historia: 'HC-7104', dni: '09384721', nombre: 'Jorge Castro Rivas', genero: 'M', edad: '65', tipoEdad: 'Años', triaje: 'Urgencia', celular: '', direccion: 'Urb. Las Brisas Mz C', email: '', ultimaVisita: '24/05/2026',
      antecedentes: 'Diabetes Tipo 2.', alergias: 'Ninguna conocida', notasMedicas: 'Paciente ingresa con picos elevados de glucosa.', activo: true
    }
  ];


  get pacientesFiltrados() {
    return this.pacientes.filter(p => p.activo === !this.verInactivos);
  }

  abrirFormulario() {
    this.esEdicion = false;
    this.indiceEdicion = null;
    const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
    this.nuevoPaciente = {
      historia: `HC-${numeroAleatorio}`,
      dni: '',
      nombre: '',
      genero: 'M',
      edad: '',
      tipoEdad: 'Años',
      triaje: 'Estable',
      celular: '',
      direccion: '',
      email: '',
      ultimaVisita: '26/05/2026',
      alergias: '',
      antecedentes: '',
      notasMedicas: 'Paciente ingresado por admisión general.',
      activo: true
    };
    this.mostrarModal = true;
  }

  editarPaciente(pacienteSeleccionado: any, index: number) {
    this.esEdicion = true;
    // Buscamos el índice real dentro del array original de pacientes
    this.indiceEdicion = this.pacientes.findIndex(p => p.historia === pacienteSeleccionado.historia);
    this.nuevoPaciente = { ...pacienteSeleccionado };
    this.mostrarModal = true;
  }

  verHistorialClinico(paciente: any) {
    this.pacienteSeleccionadoHistorial = paciente;
    this.mostrarHistorial = true;
  }

  cerrarHistorial() {
    this.mostrarHistorial = false;
    this.pacienteSeleccionadoHistorial = null;
  }

  cambiarEstadoPaciente(paciente: any) {
    const estadoActual = paciente.activo;
    const accion = estadoActual ? 'dar de baja' : 'reactivar';
    
    Swal.fire({
      title: `¿Seguro de ${accion} al paciente?`,
      text: estadoActual ? 'El paciente se moverá a la lista de inactivos.' : 'El paciente volverá a la lista de activos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: estadoActual ? '#ef4444' : '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: estadoActual ? 'Sí, dar de baja' : 'Sí, reactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        paciente.activo = !estadoActual;
        Swal.fire({
          title: estadoActual ? 'Paciente Inactivo' : 'Paciente Reactivado',
          text: `El estado del paciente ha sido actualizado.`,
          icon: 'success',
          confirmButtonColor: '#2563eb',
          timer: 1500
        });
      }
    });
  }

  cerrarFormulario() {
    this.mostrarModal = false;
  }

  agregarPaciente() {
    if (this.nuevoPaciente.nombre && this.nuevoPaciente.dni && this.nuevoPaciente.edad) {
      if (!this.nuevoPaciente.alergias.trim()) this.nuevoPaciente.alergias = 'Ninguna conocida';
      if (!this.nuevoPaciente.antecedentes.trim()) this.nuevoPaciente.antecedentes = 'Ninguno registrado';

      if (this.esEdicion && this.indiceEdicion !== null) {
        this.pacientes[this.indiceEdicion] = { ...this.nuevoPaciente };
        this.mostrarModal = false;
        Swal.fire({ title: '¡Actualizado!', text: 'Los datos fueron actualizados correctamente.', icon: 'success', confirmButtonColor: '#2563eb', timer: 2000 });
      } else {
        this.pacientes.unshift({ ...this.nuevoPaciente });
        this.mostrarModal = false;
        Swal.fire({ title: '¡Admisión Exitosa!', text: 'El paciente ha sido registrado en el sistema.', icon: 'success', confirmButtonColor: '#2563eb', timer: 2000 });
      }
    } else {
      Swal.fire({ title: '¡Oops!', text: 'Por favor, completa los datos obligatorios.', icon: 'error', confirmButtonColor: '#6366f1' });
    }
  }
}