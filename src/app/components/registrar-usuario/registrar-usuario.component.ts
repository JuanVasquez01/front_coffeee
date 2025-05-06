import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService, Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class RegistrarUsuarioComponent {
  usuario: Usuario = { username: '', password: '', correo: '', role: 'user' };

  constructor(private usuarioService: UsuarioService) {}

  registrarUsuario() {
    this.usuarioService.registrarUsuario(this.usuario).subscribe({
      next: (response) => {
        console.log('Usuario registrado:', response);
        alert('Usuario registrado con éxito');
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);
        alert('Hubo un error al registrar el usuario');
      }
    });
  }
}
