# Documentación Completa del Frontend - Sistema de Tostado de Café

## 1. Visión General
El frontend es una aplicación Angular profesional que permite:
- Control y monitoreo en tiempo real del proceso de tostado
- Visualización de datos históricos
- Gestión de usuarios y perfiles
- Interacción con todos los componentes del hardware

La aplicación está construida con Angular y sigue una arquitectura modular para facilitar el mantenimiento y la escalabilidad.

## 2. Módulos Principales

### 2.1 Módulo de Autenticación
- **Pantalla de login** (`IniciarSesionComponent`): Implementa un formulario de login con validación de credenciales.
- **Formulario de registro** (`RegistrarUsuarioComponent`): Permite a los usuarios registrarse con roles diferenciados.
- **Protección de rutas** (`AuthGuard`): Implementa la protección de rutas basada en roles (tostador/cliente).

### 2.2 Módulo de Control Principal
- **Panel de visualización en tiempo real**:
  * Gráficas de temperatura y humedad implementadas con Chart.js
  * Indicadores de estado de los actuadores
  * Tiempo transcurrido del ciclo actual
- **Sección de control manual**:
  * Botones para tostador, enfriador, agitador y convección
  * Selector de perfiles preconfigurados
  * Ajuste de parámetros personalizados

### 2.3 Módulo de Históricos
- **Tabla filtrable de ciclos completados**
- **Gráficas comparativas** de múltiples tostados
- **Exportación de datos** en formatos CSV y PDF
- **Sistema de búsqueda** por fechas/perfiles

## 3. Componentes Clave

### 3.1 Panel de Control de Actuadores
- **Interfaz intuitiva** con botones de acción/parada
- **Indicadores visuales** de estado (colores/iconos)
- **Confirmaciones** para acciones críticas
- **Deshabilitación automática** en casos de seguridad

### 3.2 Visualización de Datos
- **Gráficos interactivos** con Chart.js
- **Líneas de referencia** para perfiles seleccionados
- **Opción de pausar/descargar** datos
- **Alertas visuales** por parámetros fuera de rango

### 3.3 Gestión de Perfiles
- **CRUD completo** de perfiles de tostado
- **Previsualización** de curvas térmicas
- **Sistema de plantillas** reutilizables
- **Validación** de parámetros técnicos

## 4. Flujo de Trabajo Principal

1. **Autenticación**: 
   - Usuario ingresa credenciales en `IniciarSesionComponent`
   - Sistema redirige según rol al dashboard

2. **Inicio de Ciclo**:
   - Selección de perfil y cantidad
   - Confirmación de parámetros
   - Activación inicial

3. **Monitoreo**:
   - Visualización de datos en tiempo real
   - Ajustes manuales si es necesario
   - Notificaciones de eventos

4. **Finalización**:
   - Resumen automático del ciclo
   - Almacenamiento en histórico
   - Opciones de reinicio

## 5. Diseño de Interfaz

### 5.1 Principios UI/UX
- **Diseño responsive** (mobile/desktop/tablet)
- **Paleta de colores profesional**
- **Jerarquía visual clara**
- **Feedback inmediato** a acciones

### 5.2 Elementos Visuales
- **Tarjetas informativas** resumen
- **Barras de progreso** para etapas
- **Tooltips explicativos**
- **Modos de color** (claro/oscuro)

## 6. Integración con Backend

### 6.1 Comunicación
- **REST API** para gestión de datos a través de `HttpClient`
- **WebSockets** para actualizaciones en tiempo real
- **Servicios optimizados** para baja latencia

### 6.2 Manejo de Errores
- **Notificaciones amigables**
- **Reintentos automáticos**
- **Estados de fallo visibles**

## 7. Requisitos Técnicos

### 7.1 Dependencias
- **Angular 15+**
- **Angular Material**
- **Chart.js**
- **Moment.js**
- **NgRx** (para gestión de estado)

### 7.2 Variables de Entorno
- **URL base de API**: Configurada en `environment.ts`
- **Configuraciones de timeout**
- **Claves para servicios externos**

## 8. Consideraciones de Seguridad

- **Validación de todos los inputs**
- **Protección contra XSS**
- **CORS configurado estrictamente**
- **Manejo seguro de tokens JWT**

## 9. Pruebas y Validación

### 9.1 Suite de Pruebas
- **Unit tests** para componentes clave
- **Pruebas de integración**
- **Tests E2E** para flujos principales

### 9.2 Control de Calidad
- **Linting estricto**
- **Análisis estático de código**
- **Auditorías de performance**

## 10. Manual de Usuario

### 10.1 Para Tostadores
- **Inicio rápido de ciclos**
- **Uso de controles manuales**
- **Interpretación de gráficas**

### 10.2 Para Clientes
- **Consulta de históricos**
- **Solicitud de nuevos tostados**
- **Seguimiento de pedidos**

## 11. Roadmap y Mejoras Futuras

1. **Panel administrativo avanzado**
2. **Integración con sistemas de inventario**
3. **Notificaciones push**
4. **Soporte multi-idioma**
5. **Dashboard analítico**

## 12. Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── home/
│   │   ├── iniciar-sesion/
│   │   └── registrar-usuario/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── services/
│   │   └── usuario.service.ts
│   ├── app-routing.module.ts
│   ├── app.component.ts
│   └── app.module.ts
├── assets/
├── environments/
└── index.html
```

## 13. Estado Actual de Implementación

### Componentes Implementados
- **Home**: Página de bienvenida con navegación a login y registro
- **Iniciar Sesión**: Formulario de login con validación
- **Registrar Usuario**: Formulario de registro con validación
- **Dashboard**: Página principal después del login (versión básica)

### Servicios Implementados
- **UsuarioService**: Gestión de usuarios (registro, login, logout)

### Guardias Implementados
- **AuthGuard**: Protección básica de rutas

### Pendientes de Implementación
- Módulo de Control Principal completo
- Módulo de Históricos completo
- Panel de Control de Actuadores
- Visualización de Datos con Chart.js
- Gestión de Perfiles
- WebSockets para datos en tiempo real
- Mejoras en UI/UX según principios de diseño
