import { Component } from '@angular/core';
        import { FormsModule } from '@angular/forms';
        import { UsuarioService, Usuario } from '../../services/usuario.service';

        @Component({
          selector: 'app-registrar-usuario',
          template: `
            <div>
              <h2>Registrar Usuario</h2>
              <form (ngSubmit)="registrarUsuario()">
                <label for="username">Username:</label>
                <input id="username" [(ngModel)]="usuario.username" name="username" required />

                <label for="password">Password:</label>
                <input id="password" type="password" [(ngModel)]="usuario.password" name="password" required />

                <label for="correo">Correo:</label>
                <input id="correo" [(ngModel)]="usuario.correo" name="correo" required />

                <button type="submit">Registrar</button>
              </form>
            </div>
          `,
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
