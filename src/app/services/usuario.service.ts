import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface Usuario {
  id?: number;
  username: string;
  password: string;
  role: string;
  correo: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  iniciarSesion(username: string, password: string): Observable<Usuario> {
    // Intentar con diferentes URLs para el login
    const loginUrl = `${this.apiUrl}/login`;
    const authLoginUrl = 'http://localhost:8080/api/auth/login';

    console.log(`Intentando iniciar sesión con username: ${username}`);
    console.log(`URLs a probar: ${loginUrl}, ${authLoginUrl}`);

    // Crear el objeto de credenciales
    const credenciales = { username, password };
    console.log('Enviando credenciales:', credenciales);

    // Agregar encabezados para asegurar que se envía como JSON
    const headers = { 'Content-Type': 'application/json' };

    // Probar con diferentes formatos de credenciales para mayor compatibilidad
    const credencialesAlt = {
      username: username,
      password: password,
      // Algunos backends esperan estos nombres de campos
      userName: username,
      user: username,
      email: username
    };

    // El error 405 indica que el método POST no está soportado, intentar con GET
    console.log('Intentando con método GET en lugar de POST debido al error 405');

    // Construir URL con parámetros para GET
    const params = `?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    const loginUrlWithParams = `${loginUrl}${params}`;

    // Intentar primero con GET en la URL original
    return this.http.get<Usuario>(loginUrlWithParams)
      .pipe(
        tap(response => {
          console.log('Respuesta exitosa del servidor (GET):', response);
          if (!response) {
            console.error('La respuesta del servidor está vacía');
          }
        }),
        catchError(errorGet => {
          console.error(`Error en la petición GET a ${loginUrlWithParams}:`, errorGet);

          // Si falla GET, intentar con POST (el método original)
          console.log('GET falló, intentando con POST original');
          return this.http.post<Usuario>(loginUrl, credenciales, { headers })
            .pipe(
              tap(response => {
                console.log('Respuesta exitosa del servidor (POST):', response);
              }),
              catchError(error => {
                console.error(`Error en la petición POST a ${loginUrl}:`, error);

                // Si falla, intentar con la URL alternativa
                console.log(`Intentando con URL alternativa: ${authLoginUrl}`);
                return this.http.post<Usuario>(authLoginUrl, credenciales, { headers })
                  .pipe(
                    tap(response => {
                      console.log('Respuesta exitosa del servidor (URL alternativa):', response);
                    }),
                    catchError(error2 => {
                      console.error(`Error en la petición a ${authLoginUrl}:`, error2);

                      // Si también falla, intentar con credenciales alternativas
                      console.log('Intentando con credenciales alternativas:', credencialesAlt);
                      return this.http.post<Usuario>(loginUrl, credencialesAlt, { headers })
                        .pipe(
                          tap(response => {
                            console.log('Respuesta exitosa con credenciales alternativas:', response);
                          }),
                          catchError(error3 => {
                            console.error('Error con credenciales alternativas:', error3);

                            // Si todo falla, devolver el error original
                            console.error('Todos los intentos de login fallaron');
                            return throwError(() => error);
                          })
                        );
                    })
                  );
              })
            );
        })
      );
  }

  obtenerUsuarioActual(): Usuario | null {
    const usuarioString = localStorage.getItem('usuarioActual');
    return usuarioString ? JSON.parse(usuarioString) : null;
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuarioActual');
  }
}
