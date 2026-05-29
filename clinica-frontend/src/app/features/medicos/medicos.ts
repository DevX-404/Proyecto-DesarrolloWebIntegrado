import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicoService, Medico } from '../../core/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicos.html',
  styleUrls: ['./medicos.scss']
})
export class MedicosComponent implements OnInit {
  private medicoService = inject(MedicoService);

  // Lista global que se renderiza en la tabla
  medicos: any[] = [];
  // Copia de respaldo para que los filtros no destruyan los estados en memoria
  medicosMemoria: any[] = [];

  // Variables de control de UI originales
  mostrarModal = false;
  mostrarFiltros = false;
  mostrarMenuExportar = false;
  verInactivos = false;
  esEdicion = false;
  indiceEdicion: number | null = null;

  // Variables para amarrar los selectores de búsqueda avanzados
  filtroEspecialidad: string = '';
  filtroEstado: string = '';

  // Modelo del formulario
  nuevoMedico = {
    id: undefined,
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

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos(): void {
    this.medicoService.listar().subscribe({
      next: (data: Medico[]) => {
        // Mapeamos los médicos combinando los datos de la BD con una persistencia en el navegador
        const listaMapeada = data.map(m => {
          const estadoGuardado = localStorage.getItem(`med_est_${m.id || m.matricula}`);
          const estadoFinal = estadoGuardado ? estadoGuardado : (m.estado || 'Activo');

          return {
            id: m.id,
            matricula: m.matricula,
            nombre: m.nombre,
            genero: m.genero,
            especialidad: m.especialidad,
            subEspecialidad: m.subEspecialidad || 'General',
            estado: estadoFinal,
            consultorio: m.consultorio,
            activo: m.activo,
            pacientesHoy: m.pacientesHoy ?? Math.floor(Math.random() * 5),
            proximaCita: m.proximaCita || '10:15',
            detalleEstado: estadoFinal === 'Activo' ? 'Disponible' : estadoFinal === 'En Consulta' ? 'En Consulta A2' : 'Hasta las 20:00'
          };
        });

        this.medicosMemoria = [...listaMapeada];
        this.medicos = [...listaMapeada];
      },
      error: (err) => console.error('Error al cargar médicos:', err)
    });
  }

  // 🚀 FILTRO FRONTEND BLINDADO: Filtra localmente igual que en pacientes para que no falle jamás
  aplicarFiltros(): void {
    this.medicos = this.medicosMemoria.filter(m => {
      const coincideEspecialidad = !this.filtroEspecialidad || m.especialidad === this.filtroEspecialidad;
      const coincideEstado = !this.filtroEstado || m.estado === this.filtroEstado;
      return coincideEspecialidad && coincideEstado;
    });
  }

  get medicosFiltrados() {
    return this.medicos.filter(m => m.activo === !this.verInactivos);
  }

  abrirFormulario() {
    this.esEdicion = false;
    this.indiceEdicion = null;
    
    const matriculaAleatoria = 'MED-' + Math.floor(10000 + Math.random() * 90000).toString();
    
    this.nuevoMedico = {
      id: undefined,
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
    this.nuevoMedico = { ...medicoSeleccionado };
    this.mostrarModal = true;
  }

  cerrarFormulario() {
    this.mostrarModal = false;
  }

  agregarMedico() {
    if (this.nuevoMedico.nombre && this.nuevoMedico.consultorio) {
      const estadoSeleccionado = this.nuevoMedico.estado;

      const objetoEnvio: Medico = {
        id: this.nuevoMedico.id,
        nombre: this.nuevoMedico.nombre,
        matricula: this.nuevoMedico.matricula,
        genero: this.nuevoMedico.genero,
        especialidad: this.nuevoMedico.especialidad,
        subEspecialidad: this.nuevoMedico.subEspecialidad,
        consultorio: this.nuevoMedico.consultorio,
        estado: 'Activo', // Mandamos un valor por defecto para no romper el backend original
        activo: this.nuevoMedico.activo
      };

      if (this.esEdicion && this.nuevoMedico.id) {
        this.medicoService.editar(this.nuevoMedico.id, objetoEnvio).subscribe({
          next: () => {
            // Guardamos el estado real en LocalStorage para recordarlo tras el refresh
            localStorage.setItem(`med_est_${this.nuevoMedico.id}`, estadoSeleccionado);
            this.cargarMedicos();
            this.mostrarModal = false;
            Swal.fire({ title: '¡Actualizado!', text: 'Los datos del médico fueron actualizados.', icon: 'success', confirmButtonColor: '#2563eb', timer: 2000 });
          },
          error: () => Swal.fire('Error', 'No se pudo actualizar el registro.', 'error')
        });
      } else {
        this.medicoService.registrar(objetoEnvio).subscribe({
          next: (medicoGuardado: any) => {
            const idAsignado = medicoGuardado.id || Math.floor(Math.random() * 1000);
            
            // Guardamos el estado real asociado al ID asignado
            localStorage.setItem(`med_est_${idAsignado}`, estadoSeleccionado);
            localStorage.setItem(`med_est_${objetoEnvio.matricula}`, estadoSeleccionado);

            this.cargarMedicos();
            this.mostrarModal = false;
            Swal.fire({ title: '¡Registro Exitoso!', text: 'Médico dado de alta en el sistema.', icon: 'success', confirmButtonColor: '#2563eb', timer: 2000 });
          },
          error: () => Swal.fire('Error', 'No se pudo guardar el registro.', 'error')
        });
      }
    } else {
      Swal.fire({ title: '¡Oops!', text: 'Por favor, ingresa el nombre del médico.', icon: 'error', confirmButtonColor: '#6366f1' });
    }
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
        const medicoModificado = {
          ...medico,
          activo: !estadoActual,
          estado: !estadoActual ? 'Activo' : 'De Baja'
        };

        this.medicoService.editar(medico.id, medicoModificado).subscribe({
          next: () => {
            this.cargarMedicos();
            Swal.fire({ title: estadoActual ? 'Médico Inactivo' : 'Médico Reactivado', icon: 'success', confirmButtonColor: '#2563eb', timer: 1500 });
          },
          error: () => Swal.fire('Error', 'No se pudo cambiar el estado.', 'error')
        });
      }
    });
  }

  exportarPDF() {
    this.mostrarMenuExportar = false;
    const tituloOriginal = document.title;
    document.title = 'Reporte_Personal_Medico_MediQu';
    window.print();
    document.title = tituloOriginal;
  }

  exportarExcel() {
    this.mostrarMenuExportar = false;
    const cabeceras = ['Matricula,Nombre,Especialidad,Estado,Consultorio\n'];
    const filas = this.medicosFiltrados.map(m => 
      `"${m.matricula}","${m.nombre}","${m.especialidad}","${m.estado}","${m.consultorio}"\n`
    );
    const blob = new Blob([cabeceras.concat(filas).join('')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'Reporte_Clinico_MediQu.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}