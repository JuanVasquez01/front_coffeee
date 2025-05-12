import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface RoastingSession {
  id: number;
  date: Date;
  profileName: string;
  duration: string;
  maxTemperature: number;
  finalHumidity: number;
  notes: string;
}

@Component({
  selector: 'app-historical-data',
  templateUrl: './historical-data.component.html',
  styleUrls: ['./historical-data.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class HistoricalDataComponent implements OnInit {
  // Datos de sesiones de tostado (simulados)
  sessions: RoastingSession[] = [];

  // Filtros
  dateFilter: string = '';
  profileFilter: string = '';

  // Perfiles disponibles para filtrar
  availableProfiles: string[] = ['Perfil Suave', 'Perfil Medio', 'Perfil Intenso'];

  // Sesiones seleccionadas para comparar
  selectedSessions: number[] = [];

  constructor() { }

  ngOnInit(): void {
    // Generar datos de ejemplo
    this.generateMockData();
  }

  generateMockData(): void {
    // Generar 20 sesiones de ejemplo
    const today = new Date();

    for (let i = 0; i < 20; i++) {
      const sessionDate = new Date(today);
      sessionDate.setDate(today.getDate() - i);

      const profiles = ['Perfil Suave', 'Perfil Medio', 'Perfil Intenso'];
      const randomProfile = profiles[Math.floor(Math.random() * profiles.length)];

      // Generar duración aleatoria entre 10 y 20 minutos
      const minutes = Math.floor(Math.random() * 10) + 10;
      const seconds = Math.floor(Math.random() * 60);
      const duration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:00`;

      // Generar temperatura máxima aleatoria entre 180 y 220
      const maxTemp = Math.floor(Math.random() * 40) + 180;

      // Generar humedad final aleatoria entre 10 y 30
      const finalHumidity = Math.floor(Math.random() * 20) + 10;

      this.sessions.push({
        id: i + 1,
        date: sessionDate,
        profileName: randomProfile,
        duration: duration,
        maxTemperature: maxTemp,
        finalHumidity: finalHumidity,
        notes: `Sesión de tostado #${i + 1}`
      });
    }
  }

  applyFilters(): void {
    // Esta función se llamaría en un entorno real para filtrar datos del servidor
    console.log('Aplicando filtros:', this.dateFilter, this.profileFilter);
  }

  resetFilters(): void {
    this.dateFilter = '';
    this.profileFilter = '';
    this.applyFilters();
  }

  toggleSessionSelection(sessionId: number): void {
    const index = this.selectedSessions.indexOf(sessionId);
    if (index === -1) {
      // Si no está seleccionada, agregarla (máximo 3)
      if (this.selectedSessions.length < 3) {
        this.selectedSessions.push(sessionId);
      } else {
        alert('Puede seleccionar un máximo de 3 sesiones para comparar');
      }
    } else {
      // Si ya está seleccionada, quitarla
      this.selectedSessions.splice(index, 1);
    }
  }

  isSessionSelected(sessionId: number): boolean {
    return this.selectedSessions.includes(sessionId);
  }

  compareSelectedSessions(): void {
    if (this.selectedSessions.length < 2) {
      alert('Seleccione al menos 2 sesiones para comparar');
      return;
    }

    // En una implementación real, aquí se generarían las gráficas comparativas
    console.log('Comparando sesiones:', this.selectedSessions);
    alert(`Comparando sesiones: ${this.selectedSessions.join(', ')}`);
  }

  exportData(format: string): void {
    // En una implementación real, aquí se generaría la exportación
    console.log(`Exportando datos en formato ${format}`);
    alert(`Los datos han sido exportados en formato ${format}`);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }
}
