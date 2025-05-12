import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario.service';

interface ClientPreferences {
  favoriteRoastLevel: string;
  preferredCoffeeType: string;
  notificationsEnabled: boolean;
  deliveryAddress: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class ClientProfileComponent implements OnInit {
  usuario: Usuario | null = null;

  // Datos del perfil
  profileData = {
    username: '',
    correo: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  };

  // Preferencias del cliente
  preferences: ClientPreferences = {
    favoriteRoastLevel: 'medium',
    preferredCoffeeType: 'arabica',
    notificationsEnabled: true,
    deliveryAddress: '',
    phoneNumber: ''
  };

  // Opciones para selects
  roastLevels = [
    { value: 'light', label: 'Suave' },
    { value: 'medium', label: 'Medio' },
    { value: 'dark', label: 'Intenso' },
    { value: 'custom', label: 'Personalizado' }
  ];

  coffeeTypes = [
    { value: 'arabica', label: 'Arábica' },
    { value: 'robusta', label: 'Robusta' },
    { value: 'blend', label: 'Mezcla Especial' }
  ];

  // Estados de la UI
  editingProfile = false;
  editingPreferences = false;
  profileUpdateSuccess = false;
  preferencesUpdateSuccess = false;
  errorMessage = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.usuario = this.usuarioService.obtenerUsuarioActual();

    if (this.usuario) {
      // Cargar datos del perfil
      this.profileData.username = this.usuario.username;
      this.profileData.correo = this.usuario.correo;

      // En una implementación real, aquí se cargarían las preferencias del cliente desde el servidor
      // Simulación de preferencias
      this.loadMockPreferences();
    }
  }

  loadMockPreferences(): void {
    // Simulación de carga de preferencias
    this.preferences = {
      favoriteRoastLevel: 'medium',
      preferredCoffeeType: 'arabica',
      notificationsEnabled: true,
      deliveryAddress: 'Calle Ejemplo 123, Ciudad',
      phoneNumber: '555-123-4567'
    };
  }

  toggleEditProfile(): void {
    this.editingProfile = !this.editingProfile;
    this.profileUpdateSuccess = false;
    this.errorMessage = '';

    // Resetear contraseñas al cancelar edición
    if (!this.editingProfile) {
      this.profileData.password = '';
      this.profileData.newPassword = '';
      this.profileData.confirmPassword = '';
    }
  }

  toggleEditPreferences(): void {
    this.editingPreferences = !this.editingPreferences;
    this.preferencesUpdateSuccess = false;
    this.errorMessage = '';
  }

  updateProfile(event: Event, form: NgForm): void {
    event.preventDefault();

    if (!form.valid) {
      this.errorMessage = 'Por favor complete todos los campos requeridos correctamente';
      return;
    }

    // Validar contraseñas
    if (this.profileData.newPassword) {
      if (this.profileData.newPassword !== this.profileData.confirmPassword) {
        this.errorMessage = 'Las contraseñas nuevas no coinciden';
        return;
      }

      if (!this.profileData.password) {
        this.errorMessage = 'Debe ingresar su contraseña actual para confirmar los cambios';
        return;
      }
    }

    // En una implementación real, aquí se enviarían los datos al servidor
    // Simulación de actualización exitosa
    setTimeout(() => {
      if (this.usuario) {
        this.usuario.username = this.profileData.username;
        this.usuario.correo = this.profileData.correo;

        // Actualizar en localStorage
        localStorage.setItem('usuarioActual', JSON.stringify(this.usuario));
      }

      this.profileUpdateSuccess = true;
      this.profileData.password = '';
      this.profileData.newPassword = '';
      this.profileData.confirmPassword = '';

      // Cerrar modo edición después de un tiempo
      setTimeout(() => {
        this.editingProfile = false;
      }, 2000);
    }, 1000);
  }

  updatePreferences(event: Event, form: NgForm): void {
    event.preventDefault();

    if (!form.valid) {
      this.errorMessage = 'Por favor complete todos los campos requeridos correctamente';
      return;
    }

    // En una implementación real, aquí se enviarían las preferencias al servidor
    // Simulación de actualización exitosa
    setTimeout(() => {
      this.preferencesUpdateSuccess = true;

      // Cerrar modo edición después de un tiempo
      setTimeout(() => {
        this.editingPreferences = false;
      }, 2000);
    }, 1000);
  }

  getRoastLevelLabel(value: string): string {
    const level = this.roastLevels.find(l => l.value === value);
    return level ? level.label : value;
  }

  getCoffeeTypeLabel(value: string): string {
    const type = this.coffeeTypes.find(t => t.value === value);
    return type ? type.label : value;
  }
}
