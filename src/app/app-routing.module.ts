import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrarUsuarioComponent } from './components/registrar-usuario/registrar-usuario.component';
import { HomeComponent } from './components/home/home.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';
import { HistoricalDataComponent } from './components/historical-data/historical-data.component';
import { ProfileManagementComponent } from './components/profile-management/profile-management.component';
import { DataVisualizationComponent } from './components/data-visualization/data-visualization.component';
import { ActuatorControlComponent } from './components/actuator-control/actuator-control.component';
import { ClientOrderComponent } from './components/client-order/client-order.component';
import { ClientOrdersTrackingComponent } from './components/client-orders-tracking/client-orders-tracking.component';
import { ClientProfileComponent } from './components/client-profile/client-profile.component';
import { RoasterOrdersComponent } from './components/roaster-orders/roaster-orders.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'registrar-usuario', component: RegistrarUsuarioComponent },
  { path: 'inicio-sesion', component: IniciarSesionComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // Rutas para tostadores
  {
    path: 'control-panel',
    component: ControlPanelComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'roaster' }
  },
  {
    path: 'roaster-orders',
    component: RoasterOrdersComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'roaster' }
  },
  {
    path: 'profile-management',
    component: ProfileManagementComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'roaster' }
  },
  {
    path: 'actuator-control',
    component: ActuatorControlComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'roaster' }
  },

  // Rutas para clientes
  {
    path: 'client-order',
    component: ClientOrderComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'client' }
  },
  {
    path: 'client-orders-tracking',
    component: ClientOrdersTrackingComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'client' }
  },
  {
    path: 'client-profile',
    component: ClientProfileComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'client' }
  },

  // Rutas compartidas
  { path: 'historical-data', component: HistoricalDataComponent, canActivate: [AuthGuard] },
  { path: 'data-visualization', component: DataVisualizationComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

export { routes };
