import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UsuarioService } from './usuario.service';

export interface RoastingOrder {
  id?: number;
  clientId: number;
  clientName: string;
  coffeeType: string;
  quantity: number;
  roastLevel: string;
  specialInstructions: string;
  status: string;
  createdAt: Date;
  estimatedDelivery?: Date;
  statusHistory?: OrderStatusUpdate[];
}

export interface OrderStatusUpdate {
  status: string;
  timestamp: Date;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientOrderService {
  private apiUrl = 'http://localhost:8080/api/orders';
  private orders: RoastingOrder[] = [];
  private nextId = 1;

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) {
    // Inicializar con algunos pedidos de ejemplo
    this.generateMockOrders();
    // Generar pedidos adicionales de otros clientes para los tostadores
    this.generateAdditionalClientOrders();
  }

  /**
   * Obtiene todos los pedidos del cliente actual
   */
  getClientOrders(): Observable<RoastingOrder[]> {
    const usuario = this.usuarioService.obtenerUsuarioActual();
    if (!usuario) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    // En una implementación real, esto haría una petición HTTP
    // return this.http.get<RoastingOrder[]>(`${this.apiUrl}/client/${usuario.id}`);

    // Simulación
    const clientOrders = this.orders.filter(order => order.clientId === usuario.id);
    return of([...clientOrders]);
  }

  /**
   * Obtiene un pedido por su ID
   */
  getOrder(id: number): Observable<RoastingOrder> {
    // En una implementación real, esto haría una petición HTTP
    // return this.http.get<RoastingOrder>(`${this.apiUrl}/${id}`);

    // Simulación
    const order = this.orders.find(o => o.id === id);
    if (order) {
      return of({...order});
    }
    return throwError(() => new Error(`Pedido con ID ${id} no encontrado`));
  }

  /**
   * Crea un nuevo pedido
   */
  createOrder(order: Omit<RoastingOrder, 'id' | 'createdAt' | 'status' | 'statusHistory'>): Observable<RoastingOrder> {
    const usuario = this.usuarioService.obtenerUsuarioActual();
    if (!usuario) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    // En una implementación real, esto haría una petición HTTP
    // return this.http.post<RoastingOrder>(this.apiUrl, order);

    // Simulación
    const now = new Date();
    const estimatedDelivery = new Date(now);
    estimatedDelivery.setDate(now.getDate() + 3 + Math.floor(Math.random() * 4)); // 3-7 días después

    const newOrder: RoastingOrder = {
      ...order,
      id: this.nextId++,
      clientId: usuario.id || 0,
      clientName: usuario.username,
      status: 'pending',
      createdAt: now,
      estimatedDelivery,
      statusHistory: [
        {
          status: 'pending',
          timestamp: now,
          notes: 'Pedido recibido, esperando confirmación'
        }
      ]
    };

    this.orders.push(newOrder);
    return of({...newOrder});
  }

  /**
   * Cancela un pedido
   */
  cancelOrder(id: number): Observable<RoastingOrder> {
    // En una implementación real, esto haría una petición HTTP
    // return this.http.put<RoastingOrder>(`${this.apiUrl}/${id}/cancel`, {});

    // Simulación
    const orderIndex = this.orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return throwError(() => new Error(`Pedido con ID ${id} no encontrado`));
    }

    const order = this.orders[orderIndex];

    // Solo se pueden cancelar pedidos en ciertos estados
    if (['delivered', 'cancelled'].includes(order.status)) {
      return throwError(() => new Error(`No se puede cancelar un pedido en estado ${order.status}`));
    }

    const now = new Date();
    order.status = 'cancelled';

    if (!order.statusHistory) {
      order.statusHistory = [];
    }

    order.statusHistory.push({
      status: 'cancelled',
      timestamp: now,
      notes: 'Pedido cancelado por el cliente'
    });

    return of({...order});
  }

  /**
   * Filtra pedidos por estado
   */
  filterOrdersByStatus(status: string): Observable<RoastingOrder[]> {
    const usuario = this.usuarioService.obtenerUsuarioActual();
    if (!usuario) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    // En una implementación real, esto haría una petición HTTP
    // return this.http.get<RoastingOrder[]>(`${this.apiUrl}/client/${usuario.id}/status/${status}`);

    // Simulación
    let clientOrders = this.orders.filter(order => order.clientId === usuario.id);

    if (status !== 'all') {
      clientOrders = clientOrders.filter(order => order.status === status);
    }

    // Ordenar por fecha (más recientes primero)
    clientOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return of([...clientOrders]);
  }

  /**
   * Genera pedidos de ejemplo para simulación
   */
  private generateMockOrders(): void {
    const usuario = this.usuarioService.obtenerUsuarioActual();
    if (!usuario) {
      return;
    }

    const clientId = usuario.id || 0;
    const clientName = usuario.username;

    const coffeeTypes = ['arabica', 'robusta', 'blend'];
    const roastLevels = ['light', 'medium', 'dark', 'custom'];
    const statuses = ['pending', 'confirmed', 'processing', 'roasting', 'cooling', 'packaging', 'ready', 'delivered', 'cancelled'];

    // Generar 10 pedidos de ejemplo
    for (let i = 1; i <= 10; i++) {
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30)); // Hasta 30 días atrás

      const estimatedDelivery = new Date(createdDate);
      estimatedDelivery.setDate(createdDate.getDate() + 3 + Math.floor(Math.random() * 4)); // 3-7 días después

      const statusIndex = Math.floor(Math.random() * statuses.length);
      const status = statuses[statusIndex];

      // Generar historial de estados
      const statusHistory: OrderStatusUpdate[] = [];
      for (let j = 0; j <= statusIndex; j++) {
        const updateDate = new Date(createdDate);
        updateDate.setHours(createdDate.getHours() + j * 8); // Cada 8 horas un cambio de estado

        statusHistory.push({
          status: statuses[j],
          timestamp: updateDate,
          notes: this.getStatusNote(statuses[j])
        });
      }

      this.orders.push({
        id: this.nextId++,
        clientId,
        clientName,
        coffeeType: coffeeTypes[Math.floor(Math.random() * coffeeTypes.length)],
        quantity: 1 + Math.floor(Math.random() * 5),
        roastLevel: roastLevels[Math.floor(Math.random() * roastLevels.length)],
        specialInstructions: i % 3 === 0 ? 'Instrucciones especiales para el pedido #' + i : '',
        status,
        createdAt: createdDate,
        estimatedDelivery,
        statusHistory
      });
    }
  }

  /**
   * Obtiene una nota descriptiva para cada estado
   */
  private getStatusNote(status: string): string {
    switch (status) {
      case 'pending': return 'Pedido recibido, esperando confirmación';
      case 'confirmed': return 'Pedido confirmado, programado para procesamiento';
      case 'processing': return 'Preparando granos para el tostado';
      case 'roasting': return 'Tostando los granos según el perfil seleccionado';
      case 'cooling': return 'Enfriando los granos después del tostado';
      case 'packaging': return 'Empacando el café para preservar su frescura';
      case 'ready': return 'Café listo para ser entregado o recogido';
      case 'delivered': return 'Pedido entregado al cliente';
      case 'cancelled': return 'Pedido cancelado';
      default: return '';
    }
  }

  /**
   * Genera pedidos adicionales de otros clientes para los tostadores
   */
  private generateAdditionalClientOrders(): void {
    const coffeeTypes = ['arabica', 'robusta', 'blend'];
    const roastLevels = ['light', 'medium', 'dark', 'custom'];
    const statuses = ['pending', 'confirmed', 'processing', 'roasting', 'cooling', 'packaging', 'ready', 'delivered', 'cancelled'];
    const clientNames = ['Ana García', 'Carlos Rodríguez', 'María López', 'Juan Martínez', 'Laura Sánchez'];

    // Generar 15 pedidos adicionales de clientes ficticios
    for (let i = 1; i <= 15; i++) {
      const clientId = 100 + i; // IDs ficticios para clientes
      const clientName = clientNames[Math.floor(Math.random() * clientNames.length)];

      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30)); // Hasta 30 días atrás

      const estimatedDelivery = new Date(createdDate);
      estimatedDelivery.setDate(createdDate.getDate() + 3 + Math.floor(Math.random() * 4)); // 3-7 días después

      // Más probabilidad de pedidos pendientes o en proceso para los tostadores
      const statusIndex = Math.floor(Math.random() * 5); // Más probabilidad de estados iniciales
      const status = statuses[statusIndex];

      // Generar historial de estados
      const statusHistory: OrderStatusUpdate[] = [];
      for (let j = 0; j <= statusIndex; j++) {
        const updateDate = new Date(createdDate);
        updateDate.setHours(createdDate.getHours() + j * 8); // Cada 8 horas un cambio de estado

        statusHistory.push({
          status: statuses[j],
          timestamp: updateDate,
          notes: this.getStatusNote(statuses[j])
        });
      }

      this.orders.push({
        id: this.nextId++,
        clientId,
        clientName,
        coffeeType: coffeeTypes[Math.floor(Math.random() * coffeeTypes.length)],
        quantity: 1 + Math.floor(Math.random() * 5),
        roastLevel: roastLevels[Math.floor(Math.random() * roastLevels.length)],
        specialInstructions: i % 3 === 0 ? 'Instrucciones especiales para el pedido #' + i : '',
        status,
        createdAt: createdDate,
        estimatedDelivery,
        statusHistory
      });
    }
  }

  /**
   * Obtiene todos los pedidos (para tostadores)
   */
  getAllOrders(): Observable<RoastingOrder[]> {
    const usuario = this.usuarioService.obtenerUsuarioActual();
    if (!usuario) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    if (usuario.role !== 'roaster') {
      return throwError(() => new Error('No tiene permisos para acceder a todos los pedidos'));
    }

    // En una implementación real, esto haría una petición HTTP
    // return this.http.get<RoastingOrder[]>(this.apiUrl);

    // Simulación
    // Ordenar por fecha (más recientes primero)
    const allOrders = [...this.orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return of(allOrders);
  }

  /**
   * Filtra todos los pedidos por estado (para tostadores)
   */
  filterAllOrdersByStatus(status: string): Observable<RoastingOrder[]> {
    const usuario = this.usuarioService.obtenerUsuarioActual();
    if (!usuario) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    if (usuario.role !== 'roaster') {
      return throwError(() => new Error('No tiene permisos para acceder a todos los pedidos'));
    }

    // En una implementación real, esto haría una petición HTTP
    // return this.http.get<RoastingOrder[]>(`${this.apiUrl}/status/${status}`);

    // Simulación
    let filteredOrders = [...this.orders];

    if (status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    // Ordenar por fecha (más recientes primero)
    filteredOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return of(filteredOrders);
  }

  /**
   * Actualiza el estado de un pedido (para tostadores)
   */
  updateOrderStatus(id: number, newStatus: string, notes?: string): Observable<RoastingOrder> {
    const usuario = this.usuarioService.obtenerUsuarioActual();
    if (!usuario) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    if (usuario.role !== 'roaster') {
      return throwError(() => new Error('No tiene permisos para actualizar pedidos'));
    }

    // En una implementación real, esto haría una petición HTTP
    // return this.http.put<RoastingOrder>(`${this.apiUrl}/${id}/status`, { status: newStatus, notes });

    // Simulación
    const orderIndex = this.orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return throwError(() => new Error(`Pedido con ID ${id} no encontrado`));
    }

    const order = this.orders[orderIndex];

    // Validar transición de estado
    const validTransitions: { [key: string]: string[] } = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['processing', 'cancelled'],
      'processing': ['roasting', 'cancelled'],
      'roasting': ['cooling', 'cancelled'],
      'cooling': ['packaging', 'cancelled'],
      'packaging': ['ready', 'cancelled'],
      'ready': ['delivered', 'cancelled'],
      'delivered': [],
      'cancelled': []
    };

    if (!validTransitions[order.status].includes(newStatus)) {
      return throwError(() => new Error(`Transición de estado inválida: ${order.status} -> ${newStatus}`));
    }

    const now = new Date();
    order.status = newStatus;

    if (!order.statusHistory) {
      order.statusHistory = [];
    }

    order.statusHistory.push({
      status: newStatus,
      timestamp: now,
      notes: notes || this.getStatusNote(newStatus)
    });

    return of({...order});
  }
}
