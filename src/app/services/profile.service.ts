import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface ProfilePoint {
  time: number;
  temperature: number;
}

export interface RoastingProfile {
  id: number;
  name: string;
  description: string;
  points: ProfilePoint[];
  createdAt: Date;
  updatedAt: Date;
  isTemplate: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080/api/profiles';

  // Almacenamiento local para perfiles (simulación)
  private profiles: RoastingProfile[] = [];
  private nextId = 1;

  constructor(private http: HttpClient) {
    // Inicializar con algunos perfiles de ejemplo
    this.initializeProfiles();
  }

  /**
   * Inicializa perfiles de ejemplo
   */
  private initializeProfiles(): void {
    // Perfil suave
    const profileSuave: RoastingProfile = {
      id: this.nextId++,
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
      id: this.nextId++,
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
      id: this.nextId++,
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

  /**
   * Obtiene todos los perfiles
   */
  getProfiles(): Observable<RoastingProfile[]> {
    // En una implementación real, esto haría una petición HTTP
    // return this.http.get<RoastingProfile[]>(this.apiUrl);

    // Simulación
    return of([...this.profiles]);
  }

  /**
   * Obtiene un perfil por su ID
   */
  getProfile(id: number): Observable<RoastingProfile> {
    // En una implementación real, esto haría una petición HTTP
    // return this.http.get<RoastingProfile>(`${this.apiUrl}/${id}`);

    // Simulación
    const profile = this.profiles.find(p => p.id === id);
    if (profile) {
      return of({...profile});
    }
    return throwError(() => new Error(`Perfil con ID ${id} no encontrado`));
  }

  /**
   * Crea un nuevo perfil
   */
  createProfile(profile: Omit<RoastingProfile, 'id' | 'createdAt' | 'updatedAt'>): Observable<RoastingProfile> {
    // En una implementación real, esto haría una petición HTTP
    // return this.http.post<RoastingProfile>(this.apiUrl, profile);

    // Simulación
    const now = new Date();
    const newProfile: RoastingProfile = {
      ...profile as any,
      id: this.nextId++,
      createdAt: now,
      updatedAt: now
    };

    this.profiles.push(newProfile);
    return of({...newProfile});
  }

  /**
   * Actualiza un perfil existente
   */
  updateProfile(id: number, profile: Partial<RoastingProfile>): Observable<RoastingProfile> {
    // En una implementación real, esto haría una petición HTTP
    // return this.http.put<RoastingProfile>(`${this.apiUrl}/${id}`, profile);

    // Simulación
    const index = this.profiles.findIndex(p => p.id === id);
    if (index !== -1) {
      const updatedProfile: RoastingProfile = {
        ...this.profiles[index],
        ...profile,
        updatedAt: new Date()
      };
      this.profiles[index] = updatedProfile;
      return of({...updatedProfile});
    }
    return throwError(() => new Error(`Perfil con ID ${id} no encontrado`));
  }

  /**
   * Elimina un perfil
   */
  deleteProfile(id: number): Observable<void> {
    // En una implementación real, esto haría una petición HTTP
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);

    // Simulación
    const index = this.profiles.findIndex(p => p.id === id);
    if (index !== -1) {
      this.profiles.splice(index, 1);
      return of(void 0);
    }
    return throwError(() => new Error(`Perfil con ID ${id} no encontrado`));
  }

  /**
   * Duplica un perfil existente
   */
  duplicateProfile(id: number): Observable<RoastingProfile> {
    // Simulación
    const profile = this.profiles.find(p => p.id === id);
    if (profile) {
      const now = new Date();
      const duplicatedProfile: RoastingProfile = {
        ...JSON.parse(JSON.stringify(profile)), // Deep copy
        id: this.nextId++,
        name: `${profile.name} (Copia)`,
        isTemplate: false,
        createdAt: now,
        updatedAt: now
      };

      this.profiles.push(duplicatedProfile);
      return of({...duplicatedProfile});
    }
    return throwError(() => new Error(`Perfil con ID ${id} no encontrado`));
  }
}
