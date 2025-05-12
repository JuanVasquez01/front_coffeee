import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface ProfilePoint {
  time: number; // tiempo en minutos
  temperature: number; // temperatura en grados Celsius
}

interface RoastingProfile {
  id: number;
  name: string;
  description: string;
  points: ProfilePoint[];
  createdAt: Date;
  updatedAt: Date;
  isTemplate: boolean;
}

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class ProfileManagementComponent implements OnInit {
  // Lista de perfiles
  profiles: RoastingProfile[] = [];

  // Perfil actual para edición
  currentProfile: RoastingProfile = this.getEmptyProfile();

  // Modo de edición
  editMode: boolean = false;

  // Punto temporal para agregar a un perfil
  newPoint: ProfilePoint = { time: 0, temperature: 20 };

  constructor() { }

  ngOnInit(): void {
    // Generar datos de ejemplo
    this.generateMockProfiles();
  }

  generateMockProfiles(): void {
    // Perfil suave
    const profileSuave: RoastingProfile = {
      id: 1,
      name: 'Perfil Suave',
      description: 'Tostado suave con notas frutales',
      points: [
        { time: 0, temperature: 20 },
        { time: 2, temperature: 100 },
        { time: 5, temperature: 150 },
        { time: 8, temperature: 180 },
        { time: 10, temperature: 190 },
        { time: 12, temperature: 195 }
      ],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 días atrás
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 días atrás
      isTemplate: true
    };

    // Perfil medio
    const profileMedio: RoastingProfile = {
      id: 2,
      name: 'Perfil Medio',
      description: 'Tostado medio con equilibrio de sabores',
      points: [
        { time: 0, temperature: 20 },
        { time: 2, temperature: 120 },
        { time: 4, temperature: 160 },
        { time: 6, temperature: 190 },
        { time: 9, temperature: 205 },
        { time: 12, temperature: 210 },
        { time: 15, temperature: 215 }
      ],
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 días atrás
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 días atrás
      isTemplate: true
    };

    // Perfil intenso
    const profileIntenso: RoastingProfile = {
      id: 3,
      name: 'Perfil Intenso',
      description: 'Tostado intenso con notas ahumadas',
      points: [
        { time: 0, temperature: 20 },
        { time: 1, temperature: 100 },
        { time: 3, temperature: 150 },
        { time: 5, temperature: 180 },
        { time: 7, temperature: 200 },
        { time: 10, temperature: 220 },
        { time: 13, temperature: 225 },
        { time: 16, temperature: 230 }
      ],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 días atrás
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 días atrás
      isTemplate: true
    };

    this.profiles = [profileSuave, profileMedio, profileIntenso];
  }

  getEmptyProfile(): RoastingProfile {
    return {
      id: 0,
      name: '',
      description: '',
      points: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isTemplate: false
    };
  }

  createNewProfile(): void {
    this.currentProfile = this.getEmptyProfile();
    this.editMode = true;
  }

  editProfile(profile: RoastingProfile): void {
    // Crear una copia profunda del perfil para editar
    this.currentProfile = JSON.parse(JSON.stringify(profile));
    this.editMode = true;
  }

  deleteProfile(profileId: number): void {
    if (confirm('¿Está seguro de que desea eliminar este perfil?')) {
      this.profiles = this.profiles.filter(p => p.id !== profileId);
    }
  }

  duplicateProfile(profile: RoastingProfile): void {
    const newProfile = JSON.parse(JSON.stringify(profile));
    newProfile.id = this.getNextId();
    newProfile.name = `${profile.name} (Copia)`;
    newProfile.isTemplate = false;
    newProfile.createdAt = new Date();
    newProfile.updatedAt = new Date();

    this.profiles.push(newProfile);
  }

  addPointToProfile(): void {
    // Validar que el punto sea válido
    if (this.newPoint.time < 0 || this.newPoint.temperature < 0) {
      alert('El tiempo y la temperatura deben ser valores positivos');
      return;
    }

    // Verificar si ya existe un punto con el mismo tiempo
    const existingPoint = this.currentProfile.points.find(p => p.time === this.newPoint.time);
    if (existingPoint) {
      alert('Ya existe un punto con ese tiempo. Edite el punto existente o elija otro tiempo.');
      return;
    }

    // Agregar el punto y ordenar por tiempo
    this.currentProfile.points.push({...this.newPoint});
    this.currentProfile.points.sort((a, b) => a.time - b.time);

    // Resetear el nuevo punto
    this.newPoint = { time: 0, temperature: 20 };
  }

  removePointFromProfile(index: number): void {
    this.currentProfile.points.splice(index, 1);
  }

  saveProfile(): void {
    // Validar el perfil
    if (!this.currentProfile.name.trim()) {
      alert('El nombre del perfil es obligatorio');
      return;
    }

    if (this.currentProfile.points.length < 2) {
      alert('El perfil debe tener al menos 2 puntos');
      return;
    }

    // Actualizar o crear el perfil
    if (this.currentProfile.id === 0) {
      // Nuevo perfil
      this.currentProfile.id = this.getNextId();
      this.currentProfile.createdAt = new Date();
      this.profiles.push(this.currentProfile);
    } else {
      // Actualizar perfil existente
      const index = this.profiles.findIndex(p => p.id === this.currentProfile.id);
      if (index !== -1) {
        this.currentProfile.updatedAt = new Date();
        this.profiles[index] = {...this.currentProfile};
      }
    }

    this.editMode = false;
    this.currentProfile = this.getEmptyProfile();
  }

  cancelEdit(): void {
    this.editMode = false;
    this.currentProfile = this.getEmptyProfile();
  }

  getNextId(): number {
    return Math.max(0, ...this.profiles.map(p => p.id)) + 1;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  getMaxTemperature(profile: RoastingProfile): number {
    if (profile.points.length === 0) {
      return 0;
    }
    return Math.max(...profile.points.map(p => p.temperature));
  }

  getDuration(profile: RoastingProfile): number {
    if (profile.points.length === 0) {
      return 0;
    }
    return profile.points[profile.points.length - 1].time;
  }
}
