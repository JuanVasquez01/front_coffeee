import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink]
})
export class RegistrarUsuarioComponent {
  usuario: Usuario = { username: '', password: '', correo: '', role: 'client' };
  roles = [
    { value: 'client', label: 'Cliente' },
    { value: 'roaster', label: 'Tostador' }
  ];

  constructor(private usuarioService: UsuarioService) {}

  registrarUsuario(event: Event, form: NgForm) {
    event.preventDefault();
    console.log('Método registrarUsuario llamado');
    console.log('Datos del usuario:', this.usuario);
    console.log('Form válido:', form.valid);

    if (!form.valid) {
      console.error('Formulario inválido');
      alert('Por favor complete todos los campos correctamente');
      return;
    }

    this.usuarioService.registrarUsuario(this.usuario).subscribe({
      next: (response) => {
        console.log('Usuario registrado:', response);
        alert('Usuario registrado con éxito');
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);
        alert('Hubo un error al registrar el usuario: ' + (err.message || JSON.stringify(err)));
      }
    });
  }
}
