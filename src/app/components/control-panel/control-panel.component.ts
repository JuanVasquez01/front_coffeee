import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Esp32ConnectionService } from '../../services/esp32-connection.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class ControlPanelComponent implements OnInit, OnDestroy {
  // Variables para el estado de los actuadores
  actuadorTostador: boolean = false;
  actuadorEnfriador: boolean = false;
  actuadorAgitador: boolean = false;
  actuadorConveccion: boolean = false;

  // Variables para los datos de temperatura y humedad
  temperaturaActual: number = 25;
  humedadActual: number = 60;

  // Variables para el tiempo transcurrido
  tiempoTranscurrido: string = '00:00:00';
  tiempoInicio: number = 0;
  timerInterval: any;

  // Variables para perfiles
  perfilesDisponibles: string[] = ['Perfil Suave', 'Perfil Medio', 'Perfil Intenso'];
  perfilSeleccionado: string = '';

  // Variables para la conexión ESP32
  esp32IpAddress: string = '';
  esp32Port: string = '81';
  isConnected: boolean = false;
  connectionError: string = '';
  useSimulation: boolean = true; // Usar simulación si no hay conexión ESP32

  // Suscripciones
  private subscriptions: Subscription[] = [];

  constructor(private esp32Service: Esp32ConnectionService) { }

  ngOnInit(): void {
    // Suscribirse al estado de conexión del ESP32
    this.subscriptions.push(
      this.esp32Service.getConnectionStatus().subscribe(connected => {
        this.isConnected = connected;
        this.useSimulation = !connected;

        // Si se desconecta, iniciar simulación
        if (!connected && !this.useSimulation) {
          this.useSimulation = true;
          this.simularDatosEnTiempoReal();
        }
      })
    );

    // Suscribirse a errores de conexión
    this.subscriptions.push(
      this.esp32Service.getConnectionError().subscribe(error => {
        this.connectionError = error;
      })
    );

    // Suscribirse a datos en tiempo real del ESP32
    this.subscriptions.push(
      this.esp32Service.getRealTimeData().subscribe(data => {
        if (!this.useSimulation) {
          this.temperaturaActual = data.temperature;
          this.humedadActual = data.humidity;
          this.actuadorTostador = data.actuatorStates.tostador;
          this.actuadorEnfriador = data.actuatorStates.enfriador;
          this.actuadorAgitador = data.actuatorStates.agitador;
          this.actuadorConveccion = data.actuatorStates.conveccion;
        }
      })
    );

    // Iniciar simulación por defecto
    if (this.useSimulation) {
      this.simularDatosEnTiempoReal();
    }
  }

  ngOnDestroy(): void {
    // Limpiar todas las suscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());

    // Detener el temporizador si está activo
    this.detenerTemporizador();

    // Desconectar del ESP32 si está conectado
    if (this.isConnected) {
      this.esp32Service.disconnect();
    }
  }

  simularDatosEnTiempoReal(): void {
    // Simulación de cambios en temperatura y humedad cada segundo
    setInterval(() => {
      // Simular fluctuaciones en temperatura (entre 20 y 220 grados)
      if (this.actuadorTostador) {
        this.temperaturaActual += Math.random() * 2 - 0.5;
        this.temperaturaActual = Math.min(220, Math.max(20, this.temperaturaActual));
      } else {
        // Si el tostador está apagado, la temperatura baja gradualmente
        if (this.temperaturaActual > 25) {
          this.temperaturaActual -= 0.5;
        }
      }

      // Simular fluctuaciones en humedad (entre 10 y 90%)
      if (this.actuadorConveccion) {
        this.humedadActual -= Math.random() * 1.5;
        this.humedadActual = Math.min(90, Math.max(10, this.humedadActual));
      } else {
        // Si la convección está apagada, la humedad sube gradualmente
        if (this.humedadActual < 60) {
          this.humedadActual += 0.3;
        }
      }
    }, 1000);
  }

  toggleActuador(actuador: string): void {
    let newState: boolean;

    switch(actuador) {
      case 'tostador':
        newState = !this.actuadorTostador;
        this.actuadorTostador = newState;
        if (newState) {
          this.iniciarTemporizador();
        } else {
          this.detenerTemporizador();
        }
        break;
      case 'enfriador':
        newState = !this.actuadorEnfriador;
        this.actuadorEnfriador = newState;
        break;
      case 'agitador':
        newState = !this.actuadorAgitador;
        this.actuadorAgitador = newState;
        break;
      case 'conveccion':
        newState = !this.actuadorConveccion;
        this.actuadorConveccion = newState;
        break;
      default:
        return;
    }

    // Si está conectado al ESP32, enviar el comando
    if (this.isConnected) {
      this.esp32Service.toggleActuator(actuador, newState);
    }
  }

  iniciarTemporizador(): void {
    this.tiempoInicio = Date.now();
    this.timerInterval = setInterval(() => {
      const tiempoActual = Date.now();
      const diferencia = tiempoActual - this.tiempoInicio;

      const horas = Math.floor(diferencia / 3600000);
      const minutos = Math.floor((diferencia % 3600000) / 60000);
      const segundos = Math.floor((diferencia % 60000) / 1000);

      this.tiempoTranscurrido =
        `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }, 1000);
  }

  detenerTemporizador(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  seleccionarPerfil(perfil: string): void {
    this.perfilSeleccionado = perfil;

    // Configurar parámetros según el perfil seleccionado
    switch(perfil) {
      case 'Perfil Suave':
        // Configuración para tostado suave
        break;
      case 'Perfil Medio':
        // Configuración para tostado medio
        break;
      case 'Perfil Intenso':
        // Configuración para tostado intenso
        break;
    }
  }

  iniciarCiclo(): void {
    if (!this.perfilSeleccionado) {
      alert('Por favor seleccione un perfil antes de iniciar el ciclo');
      return;
    }

    // Iniciar actuadores según el perfil seleccionado
    this.actuadorTostador = true;
    this.actuadorAgitador = true;
    this.iniciarTemporizador();

    // Si está conectado al ESP32, enviar el comando
    if (this.isConnected) {
      this.esp32Service.startRoastingCycle(this.perfilSeleccionado);
    } else {
      alert(`Ciclo iniciado con perfil: ${this.perfilSeleccionado}`);
    }
  }

  detenerCiclo(): void {
    // Detener todos los actuadores
    this.actuadorTostador = false;
    this.actuadorEnfriador = false;
    this.actuadorAgitador = false;
    this.actuadorConveccion = false;

    this.detenerTemporizador();

    // Si está conectado al ESP32, enviar el comando
    if (this.isConnected) {
      this.esp32Service.stopRoastingCycle();
    } else {
      alert('Ciclo detenido');
    }
  }

  /**
   * Conecta al ESP32 usando la dirección IP y puerto especificados
   */
  conectarESP32(): void {
    if (!this.esp32IpAddress) {
      alert('Por favor ingrese una dirección IP válida');
      return;
    }

    // Limpiar error anterior
    this.connectionError = '';

    // Intentar conectar
    this.esp32Service.connect(this.esp32IpAddress, this.esp32Port);
  }

  /**
   * Desconecta del ESP32
   */
  desconectarESP32(): void {
    this.esp32Service.disconnect();
  }
}
