import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink]
})
export class IniciarSesionComponent {
  credenciales = {
    username: '',
    password: ''
  };
  errorMensaje = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  iniciarSesion(event: Event, form: NgForm) {
    event.preventDefault();
    console.log('Método iniciarSesion llamado');
    console.log('Credenciales:', this.credenciales);
    console.log('Form válido:', form.valid);

    if (!form.valid) {
      console.error('Formulario inválido');
      this.errorMensaje = 'Por favor complete todos los campos correctamente';
      return;
    }

    // Mostrar mensaje de carga
    this.errorMensaje = 'Iniciando sesión...';

    this.usuarioService.iniciarSesion(this.credenciales.username, this.credenciales.password).subscribe({
      next: (usuario) => {
        console.log('Usuario autenticado:', usuario);

        // Verificar que el usuario tenga los datos necesarios
        if (!usuario || !usuario.username) {
          console.error('Respuesta del servidor no contiene datos de usuario válidos:', usuario);
          this.errorMensaje = 'Error en la respuesta del servidor. Contacte al administrador.';
          return;
        }

        // Guardar información del usuario en localStorage
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        console.log('Usuario guardado en localStorage');

        // Redirigir al dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);

        // Mostrar mensaje de error más detallado
        if (err.status === 401 || err.status === 403) {
          this.errorMensaje = 'Credenciales incorrectas. Por favor intente nuevamente.';
        } else if (err.status === 404) {
          this.errorMensaje = 'Servicio de autenticación no disponible. Verifique que el servidor esté en funcionamiento.';
        } else if (err.status === 405) {
          this.errorMensaje = 'El método de autenticación no está soportado por el servidor. Se ha intentado un método alternativo.';
          console.log('Error 405 detectado - Método no soportado. La aplicación intentará usar un método alternativo.');
        } else {
          this.errorMensaje = `Error al iniciar sesión: ${err.message || 'Error desconocido'}`;
        }
      }
    });
  }
}
