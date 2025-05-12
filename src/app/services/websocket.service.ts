import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

export interface RealTimeData {
  timestamp: number;
  temperature: number;
  humidity: number;
  actuatorStates: {
    tostador: boolean;
    enfriador: boolean;
    agitador: boolean;
    conveccion: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3 segundos

  private connectionStatus = new BehaviorSubject<boolean>(false);
  private realTimeData = new Subject<RealTimeData>();

  // URL del servidor WebSocket
  private wsUrl = 'ws://localhost:8080/ws';

  constructor() { }

  /**
   * Inicia la conexión WebSocket
   */
  connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket ya está conectado o conectándose');
      return;
    }

    try {
      this.socket = new WebSocket(this.wsUrl);

      this.socket.onopen = () => {
        console.log('Conexión WebSocket establecida');
        this.connectionStatus.next(true);
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const data: RealTimeData = JSON.parse(event.data);
          this.realTimeData.next(data);
        } catch (error) {
          console.error('Error al procesar mensaje WebSocket:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('Conexión WebSocket cerrada');
        this.connectionStatus.next(false);
        this.attemptReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('Error en la conexión WebSocket:', error);
        this.connectionStatus.next(false);
      };
    } catch (error) {
      console.error('Error al crear conexión WebSocket:', error);
      this.attemptReconnect();
    }
  }

  /**
   * Intenta reconectar el WebSocket
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Intentando reconectar (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('Número máximo de intentos de reconexión alcanzado');
    }
  }

  /**
   * Cierra la conexión WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * Envía un mensaje al servidor WebSocket
   */
  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('No se puede enviar mensaje: WebSocket no está conectado');
    }
  }

  /**
   * Obtiene un Observable para el estado de la conexión
   */
  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  /**
   * Obtiene un Observable para los datos en tiempo real
   */
  getRealTimeData(): Observable<RealTimeData> {
    return this.realTimeData.asObservable();
  }

  /**
   * Simula datos en tiempo real (para desarrollo)
   */
  simulateRealTimeData(): void {
    // Iniciar un intervalo para simular datos en tiempo real
    setInterval(() => {
      const now = Date.now();

      // Generar datos aleatorios
      const data: RealTimeData = {
        timestamp: now,
        temperature: 100 + Math.random() * 100, // Entre 100 y 200
        humidity: 10 + Math.random() * 50, // Entre 10 y 60
        actuatorStates: {
          tostador: Math.random() > 0.5,
          enfriador: Math.random() > 0.7,
          agitador: Math.random() > 0.3,
          conveccion: Math.random() > 0.6
        }
      };

      // Emitir los datos simulados
      this.realTimeData.next(data);
    }, 1000); // Cada segundo
  }
}
