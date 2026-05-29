import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { MedicoService, Medico } from '../../core/services/medico.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private medicoService = inject(MedicoService);

  tarjetas: any[] = [];
  tarjetasMedicos: any[] = []; 
  medicosListaGeneral: any[] = []; // 🚀 Nueva variable para rellenar la tabla inferior
  cargando = true;
  errorOcurrido = false;

  mostrarModalMedicos = false;
  tituloModal = '';
  colorModal = '';
  medicosFiltradosModal: any[] = [];

  ngOnInit(): void {
    this.cargarMetricasClinicas();
  }

  cargarMetricasClinicas(): void {
    this.dashboardService.getMetrics().subscribe({
      next: (data) => {
        this.tarjetas = [
          { titulo: 'Total Pacientes', valor: data.totalPacientes, colorBarra: 'bg-blue-500', progreso: '75%', textoPorcentaje: '+12%' },
          { titulo: 'Total Médicos', valor: data.totalMedicos, colorBarra: 'bg-indigo-500', progreso: '50%', textoPorcentaje: '+4%' },
          { titulo: 'Citas Programadas', valor: data.totalCitasProgramadas, colorBarra: 'bg-purple-500', progreso: '85%', textoPorcentaje: '+22%' },
          { titulo: 'Citas para Hoy', valor: data.citasHoy, colorBarra: 'bg-amber-500', progreso: '100%', textoPorcentaje: 'Hoy' }
        ];

        this.cargarEstadosMedicosDashboard();
      },
      error: (err) => {
        console.error('Error al conectar con el dashboard de Spring:', err);
        this.errorOcurrido = true;
        this.cargando = false;
      }
    });
  }

  cargarEstadosMedicosDashboard(): void {
    this.medicoService.listar().subscribe({
      next: (data: Medico[]) => {
        const medicosProcesados = data.map(m => {
          const estadoGuardado = localStorage.getItem(`med_est_${m.id || m.matricula}`);
          return {
            ...m,
            estado: estadoGuardado ? estadoGuardado : (m.estado || 'Activo')
          };
        }).filter(m => m.activo !== false);

        // Guardamos la lista completa procesada para renderizar la tabla inferior
        this.medicosListaGeneral = medicosProcesados;

        const activos = medicosProcesados.filter(m => m.estado === 'Activo');
        const enConsulta = medicosProcesados.filter(m => m.estado === 'En Consulta');
        const enGuardia = medicosProcesados.filter(m => m.estado === 'En Guardia');

        this.tarjetasMedicos = [
          { titulo: 'Médicos Activos', valor: activos.length, colorTexto: 'text-emerald-600', colorBg: 'bg-emerald-50 border-emerald-100', badgeColor: 'bg-emerald-500', tipo: 'Activo', lista: activos },
          { titulo: 'En Consulta', valor: enConsulta.length, colorTexto: 'text-blue-600', colorBg: 'bg-blue-50 border-blue-100', badgeColor: 'bg-blue-600', tipo: 'En Consulta', lista: enConsulta },
          { titulo: 'En Guardia', valor: enGuardia.length, colorTexto: 'text-cyan-600', colorBg: 'bg-cyan-50 border-cyan-100', badgeColor: 'bg-cyan-600', tipo: 'En Guardia', lista: enGuardia }
        ];

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al procesar médicos en dashboard:', err);
        this.cargando = false;
      }
    });
  }

  abrirModalMedicos(tarjeta: any): void {
    this.tituloModal = `Personal Médico: ${tarjeta.titulo}`;
    this.colorModal = tarjeta.badgeColor;
    this.medicosFiltradosModal = tarjeta.lista;
    this.mostrarModalMedicos = true;
  }

  cerrarModalMedicos(): void {
    this.mostrarModalMedicos = false;
  }
}