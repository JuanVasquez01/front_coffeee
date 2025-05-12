import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface DataPoint {
  time: number;
  temperature: number;
  humidity?: number;
}

export interface RoastingSession {
  id: number;
  date: Date;
  profileName: string;
  profileId: number;
  duration: string;
  maxTemperature: number;
  finalHumidity: number;
  notes: string;
  data: DataPoint[];
}

@Injectable({
  providedIn: 'root'
})
export class HistoricalDataService {
  private apiUrl = 'http://localhost:8080/api/sessions';

  // Almacenamiento local para sesiones (simulación)
  private sessions: RoastingSession[] = [];

  constructor(private http: HttpClient) {
    // Inicializar con algunas sesiones de ejemplo
    this.initializeSessions();
  }

  /**
   * Inicializa sesiones de ejemplo
   */
  private initializeSessions(): void {
    const today = new Date();
    const profiles = ['Perfil Suave', 'Perfil Medio', 'Perfil Intenso'];

    for (let i = 0; i < 20; i++) {
      const sessionDate = new Date(today);
      sessionDate.setDate(today.getDate() - i);

      const randomProfile = profiles[Math.floor(Math.random() * profiles.length)];
      const profileId = randomProfile === 'Perfil Suave' ? 1 :
                        randomProfile === 'Perfil Medio' ? 2 : 3;

      // Generar duración aleatoria entre 10 y 20 minutos
      const minutes = Math.floor(Math.random() * 10) + 10;
      const seconds = Math.floor(Math.random() * 60);
      const duration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:00`;

      // Generar temperatura máxima aleatoria entre 180 y 220
      const maxTemp = Math.floor(Math.random() * 40) + 180;

      // Generar humedad final aleatoria entre 10 y 30
      const finalHumidity = Math.floor(Math.random() * 20) + 10;

      // Generar datos de la sesión
      const data: DataPoint[] = [];
      const totalPoints = minutes * 60 + seconds; // Un punto por segundo

      for (let j = 0; j <= totalPoints; j += 10) { // Un punto cada 10 segundos para simplificar
        const timeMinutes = j / 60;
        let temperature;

        // Simular una curva de temperatura realista
        if (timeMinutes < 2) {
          temperature = 20 + timeMinutes * 40; // Calentamiento inicial rápido
        } else if (timeMinutes < 8) {
          temperature = 100 + (timeMinutes - 2) * 15; // Fase de desarrollo
        } else if (timeMinutes < 15) {
          temperature = 190 + (timeMinutes - 8) * 5; // Fase de tostado
        } else {
          temperature = 225 + Math.sin((timeMinutes - 15) * 0.5) * 5; // Fase final con pequeñas fluctuaciones
        }

        // Simular una curva de humedad que disminuye con el tiempo
        const initialHumidity = 60;
        const finalHumidityPoint = 10;
        const decayRate = 0.15;
        const humidity = finalHumidityPoint + (initialHumidity - finalHumidityPoint) * Math.exp(-decayRate * timeMinutes);

        data.push({
          time: j,
          temperature,
          humidity
        });
      }

      this.sessions.push({
        id: i + 1,
        date: sessionDate,
        profileName: randomProfile,
        profileId,
        duration,
        maxTemperature: maxTemp,
        finalHumidity,
        notes: `Sesión de tostado #${i + 1}`,
        data
      });
    }
  }

  /**
   * Obtiene todas las sesiones
   */
  getSessions(): Observable<RoastingSession[]> {
    // En una implementación real, esto haría una petición HTTP
    // return this.http.get<RoastingSession[]>(this.apiUrl);

    // Simulación
    return of([...this.sessions]);
  }

  /**
   * Obtiene una sesión por su ID
   */
  getSession(id: number): Observable<RoastingSession> {
    // En una implementación real, esto haría una petición HTTP
    // return this.http.get<RoastingSession>(`${this.apiUrl}/${id}`);

    // Simulación
    const session = this.sessions.find(s => s.id === id);
    if (session) {
      return of({...session});
    }
    return throwError(() => new Error(`Sesión con ID ${id} no encontrada`));
  }

  /**
   * Filtra sesiones por fecha y/o perfil
   */
  filterSessions(dateFilter?: string, profileFilter?: string): Observable<RoastingSession[]> {
    // En una implementación real, esto haría una petición HTTP con parámetros
    // return this.http.get<RoastingSession[]>(`${this.apiUrl}?date=${dateFilter}&profile=${profileFilter}`);

    // Simulación
    let filteredSessions = [...this.sessions];

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filteredSessions = filteredSessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate.getFullYear() === filterDate.getFullYear() &&
               sessionDate.getMonth() === filterDate.getMonth() &&
               sessionDate.getDate() === filterDate.getDate();
      });
    }

    if (profileFilter) {
      filteredSessions = filteredSessions.filter(session =>
        session.profileName === profileFilter
      );
    }

    return of(filteredSessions);
  }

  /**
   * Exporta datos de sesiones en formato CSV
   */
  exportSessionsCSV(sessionIds: number[]): Observable<string> {
    // En una implementación real, esto podría hacer una petición HTTP o generar el CSV en el cliente

    // Simulación: Generar CSV básico
    const sessions = this.sessions.filter(s => sessionIds.includes(s.id));

    if (sessions.length === 0) {
      return throwError(() => new Error('No se encontraron sesiones para exportar'));
    }

    // Cabecera del CSV
    let csv = 'ID,Fecha,Perfil,Duración,Temperatura Máxima,Humedad Final,Notas\n';

    // Datos
    sessions.forEach(session => {
      const date = new Date(session.date).toLocaleDateString();
      csv += `${session.id},${date},"${session.profileName}",${session.duration},${session.maxTemperature},${session.finalHumidity},"${session.notes}"\n`;
    });

    return of(csv);
  }

  /**
   * Exporta datos de sesiones en formato PDF (simulado)
   */
  exportSessionsPDF(sessionIds: number[]): Observable<boolean> {
    // En una implementación real, esto generaría un PDF

    // Simulación: Solo verificar que existan las sesiones
    const sessions = this.sessions.filter(s => sessionIds.includes(s.id));

    if (sessions.length === 0) {
      return throwError(() => new Error('No se encontraron sesiones para exportar'));
    }

    // Simular éxito
    return of(true);
  }

  /**
   * Obtiene datos para comparar múltiples sesiones
   */
  getComparisonData(sessionIds: number[]): Observable<RoastingSession[]> {
    // En una implementación real, esto podría hacer una petición HTTP específica

    // Simulación
    const sessions = this.sessions.filter(s => sessionIds.includes(s.id));

    if (sessions.length === 0) {
      return throwError(() => new Error('No se encontraron sesiones para comparar'));
    }

    return of(sessions);
  }
}
