import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const usuario = this.usuarioService.obtenerUsuarioActual();

    if (usuario) {
      return true;
    }

    // Si no hay usuario autenticado, redirigir al inicio de sesión
    return this.router.createUrlTree(['/inicio-sesion']);
  }
}
