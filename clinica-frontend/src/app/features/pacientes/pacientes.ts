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

  verInactivos: boolean = false;
  mostrarFiltros: boolean = false;
  mostrarMenuExportar: boolean = false;
  mostrarModal: boolean = false;
  esEdicion: boolean = false;
  mostrarHistorial: boolean = false;


  filtroBusquedaPaciente: string = '';
  filtroTriaje: string = '';
  filtroEtapa: string = '';
  filtroUnidadTiempo: string = '';

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

  // 🚀 PROPIEDAD REACTIVA: Filtra de manera combinada según todos los selectores de la pantalla
  get pacientesFiltrados() {
    return this.pacientes.filter(p => {
      // 1. Filtro por Activo / Inactivo
      const coincideEstado = p.activo === !this.verInactivos;
      
      // 2. Filtro por la barra de búsqueda (Nombre o DNI)
      const coincideTexto = !this.filtroBusquedaPaciente.trim() || 
        p.nombre.toLowerCase().includes(this.filtroBusquedaPaciente.toLowerCase()) ||
        p.dni.includes(this.filtroBusquedaPaciente);
        
      // 3. Filtro por selector de Triaje
      const coincideTriaje = !this.filtroTriaje || p.triaje === this.filtroTriaje;
      
      // 4. Filtro por selector de Etapa (Adultos >= 18 años o Pediatría < 18 años / meses)
      let coincideEtapa = true;
      if (this.filtroEtapa === 'adultos') {
        coincideEtapa = p.tipoEdad === 'Años' && +p.edad >= 18;
      } else if (this.filtroEtapa === 'pediatria') {
        coincideEtapa = p.tipoEdad === 'Meses' || (p.tipoEdad === 'Años' && +p.edad < 18);
      }
      
      // 5. Filtro por Unidad de tiempo (Años o Meses)
      const coincideUnidad = !this.filtroUnidadTiempo || p.tipoEdad === this.filtroUnidadTiempo;

      return coincideEstado && coincideTexto && coincideTriaje && coincideEtapa && coincideUnidad;
    });
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

  exportarPDF() {
    this.mostrarMenuExportar = false;
    console.log('Generando reporte PDF...');

    const tituloOriginal = document.title;
    document.title = 'Reporte_Pacientes_MediQu';

    window.print();

    document.title = tituloOriginal;
  }

  exportarExcel() {
    this.mostrarMenuExportar = false;
    console.log('Exportando a formato Excel CSV...');

    const cabeceras = 'Historial,Nombre,DNI,Edad,Genero,Triaje,Estado\n';

    const filas = this.pacientesFiltrados.map(p => 
      `"${p.historia || '—'}","${p.nombre}","${p.dni}","${p.edad} ${p.tipoEdad}","${p.genero}","${p.triaje}","${p.activo ? 'Activo' : 'Inactivo'}"`
    ).join('\n');

    const blob = new Blob([cabeceras + filas], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'Reporte_Admision_Pacientes_MediQu.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}