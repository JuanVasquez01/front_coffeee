import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrarUsuarioComponent } from './components/registrar-usuario/registrar-usuario.component';
import { HomeComponent } from './components/home/home.component'; // Importa HomeComponent

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'registrar-usuario', component: RegistrarUsuarioComponent },
  { path: 'inicio-sesion', component: HomeComponent } // Cambia este componente si tienes otro para inicio de sesión
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

// Exporta las rutas para usarlas en otros archivos
export { routes };
