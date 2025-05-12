import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class DashboardComponent implements OnInit {
  usuario: Usuario | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.obtenerUsuarioActual();
    if (!this.usuario) {
      // Si no hay usuario autenticado, redirigir al inicio de sesión
      this.router.navigate(['/inicio-sesion']);
    }
  }

  cerrarSesion(): void {
    this.usuarioService.cerrarSesion();
    this.router.navigate(['/']);
  }
}
