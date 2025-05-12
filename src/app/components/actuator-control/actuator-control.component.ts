import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Actuator {
  id: string;
  name: string;
  status: boolean;
  icon: string;
  description: string;
  requiresConfirmation: boolean;
  safetyWarning?: string;
}

@Component({
  selector: 'app-actuator-control',
  templateUrl: './actuator-control.component.html',
  styleUrls: ['./actuator-control.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ActuatorControlComponent implements OnInit {
  @Input() showDescriptions: boolean = true;
  @Input() compactMode: boolean = false;
  @Input() disableAll: boolean = false;

  @Output() actuatorToggled = new EventEmitter<{id: string, status: boolean}>();

  actuators: Actuator[] = [];
  confirmingActuator: string | null = null;

  constructor() { }

  ngOnInit(): void {
    this.initializeActuators();
  }

  initializeActuators(): void {
    this.actuators = [
      {
        id: 'tostador',
        name: 'Tostador',
        status: false,
        icon: 'fire',
        description: 'Controla la fuente de calor principal del tostador',
        requiresConfirmation: true,
        safetyWarning: 'Activar el tostador incrementará la temperatura rápidamente. ¿Está seguro?'
      },
      {
        id: 'enfriador',
        name: 'Enfriador',
        status: false,
        icon: 'snowflake',
        description: 'Activa el sistema de enfriamiento para reducir la temperatura',
        requiresConfirmation: false
      },
      {
        id: 'agitador',
        name: 'Agitador',
        status: false,
        icon: 'sync',
        description: 'Controla el mecanismo de agitación para mover los granos',
        requiresConfirmation: false
      },
      {
        id: 'conveccion',
        name: 'Convección',
        status: false,
        icon: 'wind',
        description: 'Activa el sistema de circulación de aire',
        requiresConfirmation: false
      }
    ];
  }

  toggleActuator(actuatorId: string): void {
    const actuator = this.actuators.find(a => a.id === actuatorId);

    if (!actuator || this.disableAll) {
      return;
    }

    // Si requiere confirmación y está intentando activarlo
    if (actuator.requiresConfirmation && !actuator.status) {
      this.confirmingActuator = actuatorId;
      return;
    }

    this.setActuatorStatus(actuatorId, !actuator.status);
  }

  confirmToggle(confirm: boolean): void {
    if (!this.confirmingActuator || !confirm) {
      this.confirmingActuator = null;
      return;
    }

    const actuator = this.actuators.find(a => a.id === this.confirmingActuator);
    if (actuator) {
      this.setActuatorStatus(actuator.id, !actuator.status);
    }

    this.confirmingActuator = null;
  }

  setActuatorStatus(actuatorId: string, status: boolean): void {
    const actuator = this.actuators.find(a => a.id === actuatorId);
    if (actuator) {
      actuator.status = status;
      this.actuatorToggled.emit({ id: actuatorId, status });

      // Lógica de seguridad: si se apaga el tostador, verificar si debemos encender el enfriador
      if (actuatorId === 'tostador' && !status) {
        this.checkCoolingNeeded();
      }

      // Lógica de seguridad: si se enciende el enfriador, apagar el tostador
      if (actuatorId === 'enfriador' && status) {
        this.setActuatorStatus('tostador', false);
      }
    }
  }

  checkCoolingNeeded(): void {
    // En una implementación real, esto verificaría la temperatura actual
    // y activaría automáticamente el enfriador si es necesario
    const shouldActivateCooling = true; // Simulación

    if (shouldActivateCooling) {
      const enfriador = this.actuators.find(a => a.id === 'enfriador');
      if (enfriador && !enfriador.status) {
        if (confirm('¿Desea activar el enfriador automáticamente?')) {
          this.setActuatorStatus('enfriador', true);
        }
      }
    }
  }

  getActuatorStatusText(status: boolean): string {
    return status ? 'Encendido' : 'Apagado';
  }

  getActuatorStatusClass(status: boolean): string {
    return status ? 'active' : 'inactive';
  }

  isConfirming(actuatorId: string): boolean {
    return this.confirmingActuator === actuatorId;
  }
}
