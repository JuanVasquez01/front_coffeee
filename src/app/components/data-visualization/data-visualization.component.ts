import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface DataPoint {
  time: number;
  temperature: number;
  humidity?: number;
}

interface DataSeries {
  id: number;
  name: string;
  color: string;
  data: DataPoint[];
  isReference?: boolean;
}

@Component({
  selector: 'app-data-visualization',
  templateUrl: './data-visualization.component.html',
  styleUrls: ['./data-visualization.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class DataVisualizationComponent implements OnInit {
  @Input() dataSeries: DataSeries[] = [];
  @Input() showHumidity: boolean = false;
  @Input() allowComparison: boolean = false;
  @Input() isRealTime: boolean = false;

  // Opciones de visualización
  chartType: string = 'line';
  timeRange: number = 30; // minutos
  autoScale: boolean = true;
  minTemp: number = 0;
  maxTemp: number = 250;
  minHumidity: number = 0;
  maxHumidity: number = 100;

  // Estado de la visualización
  isPaused: boolean = false;
  selectedSeries: number[] = [];

  constructor() { }

  ngOnInit(): void {
    // Si no se proporcionan datos, generar datos de ejemplo
    if (this.dataSeries.length === 0) {
      this.generateMockData();
    }
  }

  generateMockData(): void {
    // Generar datos de ejemplo para la visualización

    // Serie de datos actual
    const currentData: DataPoint[] = [];
    for (let i = 0; i <= 20; i++) {
      currentData.push({
        time: i,
        temperature: this.generateTemperature(i),
        humidity: this.generateHumidity(i)
      });
    }

    // Serie de datos de referencia (perfil)
    const referenceData: DataPoint[] = [];
    for (let i = 0; i <= 20; i++) {
      referenceData.push({
        time: i,
        temperature: this.generateReferenceTemperature(i)
      });
    }

    this.dataSeries = [
      {
        id: 1,
        name: 'Tostado Actual',
        color: '#FF5722',
        data: currentData
      },
      {
        id: 2,
        name: 'Perfil de Referencia',
        color: '#2196F3',
        data: referenceData,
        isReference: true
      }
    ];
  }

  generateTemperature(time: number): number {
    // Simular una curva de temperatura realista
    if (time < 2) {
      return 20 + time * 40; // Calentamiento inicial rápido
    } else if (time < 8) {
      return 100 + (time - 2) * 15; // Fase de desarrollo
    } else if (time < 15) {
      return 190 + (time - 8) * 5; // Fase de tostado
    } else {
      return 225 + Math.sin((time - 15) * 0.5) * 5; // Fase final con pequeñas fluctuaciones
    }
  }

  generateReferenceTemperature(time: number): number {
    // Generar una curva de referencia ligeramente diferente
    if (time < 2) {
      return 25 + time * 35; // Calentamiento inicial
    } else if (time < 8) {
      return 95 + (time - 2) * 15; // Fase de desarrollo
    } else if (time < 15) {
      return 185 + (time - 8) * 5; // Fase de tostado
    } else {
      return 220; // Fase final estable
    }
  }

  generateHumidity(time: number): number {
    // Simular una curva de humedad que disminuye con el tiempo
    const initialHumidity = 60;
    const finalHumidity = 10;
    const decayRate = 0.15;

    return finalHumidity + (initialHumidity - finalHumidity) * Math.exp(-decayRate * time);
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
    // En una implementación real, esto detendría la actualización de datos en tiempo real
  }

  resetZoom(): void {
    // En una implementación real, esto restablecería el zoom del gráfico
    console.log('Zoom restablecido');
  }

  exportChart(format: string): void {
    // En una implementación real, esto exportaría el gráfico en el formato especificado
    console.log(`Exportando gráfico en formato ${format}`);
    alert(`El gráfico ha sido exportado en formato ${format}`);
  }

  toggleSeries(seriesId: number): void {
    const index = this.selectedSeries.indexOf(seriesId);
    if (index === -1) {
      this.selectedSeries.push(seriesId);
    } else {
      this.selectedSeries.splice(index, 1);
    }
    // En una implementación real, esto mostraría u ocultaría la serie en el gráfico
  }

  isSeriesSelected(seriesId: number): boolean {
    return this.selectedSeries.includes(seriesId);
  }

  updateChartSettings(): void {
    // En una implementación real, esto actualizaría la configuración del gráfico
    console.log('Configuración actualizada:', {
      chartType: this.chartType,
      timeRange: this.timeRange,
      autoScale: this.autoScale,
      minTemp: this.minTemp,
      maxTemp: this.maxTemp,
      minHumidity: this.minHumidity,
      maxHumidity: this.maxHumidity
    });
  }

  getMaxTemperature(series: DataSeries): number {
    if (series.data.length === 0) {
      return 0;
    }
    return Math.max(...series.data.map(p => p.temperature));
  }

  getMinTemperature(series: DataSeries): number {
    if (series.data.length === 0) {
      return 0;
    }
    return Math.min(...series.data.map(p => p.temperature));
  }
}
