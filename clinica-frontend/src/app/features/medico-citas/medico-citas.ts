import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitaService, CitaMedica } from '../../core/services/cita.service';

@Component({
  selector: 'app-medico-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medico-citas.html'
})
export class MedicoCitasComponent implements OnInit {
  private citaService = inject(CitaService);

  medicoIdLogueado: number = 1; 

  citas: CitaMedica[] = [];
  citasDelDiaSeleccionado: CitaMedica[] = [];
  
  diasDeLaSemana: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  fechaActual: Date = new Date();
  mesActual: number = this.fechaActual.getMonth();
  anioActual: number = this.fechaActual.getFullYear();
  diaSeleccionado: number | null = this.fechaActual.getDate();
  
  grillaDias: (number | null)[] = [];

  ngOnInit(): void {
    this.cargarCitasMedico();
  }

  cargarCitasMedico(): void {
    this.citaService.listarMisCitas().subscribe({
      next: (data: CitaMedica[]) => {
        this.citas = data;
        this.generarCalendario();
        this.seleccionarDia(this.diaSeleccionado);
      },
      error: (err) => console.error('Error al cargar la agenda médica', err)
    });
  }

  generarCalendario(): void {
    const primerDiaMes = new Date(this.anioActual, this.mesActual, 1).getDay();
    const totalDiasMes = new Date(this.anioActual, this.mesActual + 1, 0).getDate();
    
    this.grillaDias = [];

    for (let i = 0; i < primerDiaMes; i++) {
      this.grillaDias.push(null);
    }

    for (let dia = 1; dia <= totalDiasMes; dia++) {
      this.grillaDias.push(dia);
    }
  }

  cambiarMes(direccion: number): void {
    this.mesActual += direccion;
    if (this.mesActual < 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else if (this.mesActual > 11) {
      this.mesActual = 0;
      this.anioActual++;
    }
    this.diaSeleccionado = null;
    this.citasDelDiaSeleccionado = [];
    this.generarCalendario();
  }

  tieneCita(dia: number | null): boolean {
    if (!dia) return false;
    const fechaStr = this.formatearFechaBusqueda(dia);
    return this.citas.some(cita => cita.fechaCita.toString().startsWith(fechaStr));
  }

  seleccionarDia(dia: number | null): void {
    if (!dia) return;
    this.diaSeleccionado = dia;
    const fechaStr = this.formatearFechaBusqueda(dia);
    
    this.citasDelDiaSeleccionado = this.citas.filter(cita => 
      cita.fechaCita.toString().startsWith(fechaStr)
    );
  }

  private formatearFechaBusqueda(dia: number): string {
    const mesFormateado = (this.mesActual + 1).toString().padStart(2, '0');
    const diaFormateado = dia.toString().padStart(2, '0');
    return `${this.anioActual}-${mesFormateado}-${diaFormateado}`;
  }
}