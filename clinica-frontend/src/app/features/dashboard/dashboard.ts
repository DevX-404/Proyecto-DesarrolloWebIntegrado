import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  // Configuración de tarjetas inspirada fielmente en tu imagen de referencia
  tarjetas = [
    { titulo: 'Pacientes registrados', valor: '38,125', progreso: '75%', colorBarra: 'bg-emerald-500', textoPorcentaje: '+ 6.1%' },
    { titulo: 'Médicos registrados', valor: '5,024', progreso: '45%', colorBarra: 'bg-blue-500', textoPorcentaje: '81%' },
    { titulo: 'Citas de Hoy', valor: '420', progreso: '60%', colorBarra: 'bg-purple-500', textoPorcentaje: '68%' },
    { titulo: 'Triaje Completo', valor: '120', progreso: '32%', colorBarra: 'bg-amber-500', textoPorcentaje: '32%' }
  ];
}