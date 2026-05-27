import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  // Esta es la lista que lee el HTML de tu pareja
  tarjetas: any[] = [];
  cargando = true;
  errorOcurrido = false;

  // CORRECCIÓN DEL ERROR: Cambiado de ': OnInit' a ': void'
  ngOnInit(): void {
    this.cargarMetricasClinicas();
  }

  cargarMetricasClinicas(): void {
    this.dashboardService.getMetrics().subscribe({
      next: (data) => {
        // Mapeamos los datos del backend en la estructura exacta que inventó tu pareja
        this.tarjetas = [
          { 
            titulo: 'Total Pacientes', 
            valor: data.totalPacientes, 
            colorBarra: 'bg-blue-500', 
            progreso: '75%', 
            textoPorcentaje: '+12%' 
          },
          { 
            titulo: 'Total Médicos', 
            valor: data.totalMedicos, 
            colorBarra: 'bg-emerald-500', 
            progreso: '50%', 
            textoPorcentaje: '+4%' 
          },
          { 
            titulo: 'Citas Programadas', 
            valor: data.totalCitasProgramadas, 
            colorBarra: 'bg-purple-500', 
            progreso: '85%', 
            textoPorcentaje: '+22%' 
          },
          { 
            titulo: 'Citas para Hoy', 
            valor: data.citasHoy, 
            colorBarra: 'bg-amber-500', 
            progreso: '100%', 
            textoPorcentaje: 'Hoy' 
          }
        ];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al conectar con el dashboard de Spring:', err);
        this.errorOcurrido = true;
        this.cargando = false;
      }
    });
  }
}