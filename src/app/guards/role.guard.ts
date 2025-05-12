import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const usuario = this.usuarioService.obtenerUsuarioActual();

    // Si no hay usuario autenticado, redirigir al inicio de sesión
    if (!usuario) {
      return this.router.createUrlTree(['/inicio-sesion']);
    }

    // Verificar si el usuario tiene el rol requerido
    const requiredRole = route.data['role'] as string;

    if (!requiredRole || usuario.role === requiredRole) {
      return true;
    }

    // Si el usuario no tiene el rol requerido, redirigir al dashboard
    return this.router.createUrlTree(['/dashboard']);
  }
}
