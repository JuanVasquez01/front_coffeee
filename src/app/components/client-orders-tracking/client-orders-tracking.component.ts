import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { ClientOrderService, RoastingOrder } from '../../services/client-order.service';

@Component({
  selector: 'app-client-orders-tracking',
  templateUrl: './client-orders-tracking.component.html',
  styleUrls: ['./client-orders-tracking.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class ClientOrdersTrackingComponent implements OnInit {
  clientId: number = 0;
  filteredOrders: RoastingOrder[] = [];
  selectedOrder: RoastingOrder | null = null;

  statusFilter: string = 'all';

  statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'processing', label: 'En Proceso' },
    { value: 'roasting', label: 'Tostando' },
    { value: 'cooling', label: 'Enfriando' },
    { value: 'packaging', label: 'Empacando' },
    { value: 'ready', label: 'Listo para Entrega' },
    { value: 'delivered', label: 'Entregado' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  constructor(
    private usuarioService: UsuarioService,
    private clientOrderService: ClientOrderService
  ) {}

  ngOnInit(): void {
    const usuario = this.usuarioService.obtenerUsuarioActual();
    if (usuario) {
      this.clientId = usuario.id || 0;
      this.loadClientOrders();
    }
  }

  loadClientOrders(): void {
    this.clientOrderService.getClientOrders().subscribe({
      next: (orders) => {
        console.log('Pedidos cargados:', orders);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error al cargar pedidos:', error);
      }
    });
  }

  applyFilters(): void {
    this.clientOrderService.filterOrdersByStatus(this.statusFilter).subscribe({
      next: (filteredOrders) => {
        this.filteredOrders = filteredOrders;
      },
      error: (error) => {
        console.error('Error al filtrar pedidos:', error);
        this.filteredOrders = [];
      }
    });
  }

  viewOrderDetails(order: RoastingOrder): void {
    this.clientOrderService.getOrder(order.id!).subscribe({
      next: (orderDetails) => {
        this.selectedOrder = orderDetails;
      },
      error: (error) => {
        console.error('Error al obtener detalles del pedido:', error);
      }
    });
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  cancelOrder(orderId: number): void {
    if (confirm('¿Está seguro de que desea cancelar este pedido?')) {
      this.clientOrderService.cancelOrder(orderId).subscribe({
        next: (cancelledOrder) => {
          console.log('Pedido cancelado:', cancelledOrder);

          // Si estamos viendo los detalles del pedido cancelado, actualizarlos
          if (this.selectedOrder && this.selectedOrder.id === orderId) {
            this.selectedOrder = cancelledOrder;
          }

          // Recargar la lista de pedidos
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error al cancelar pedido:', error);
          alert(`No se pudo cancelar el pedido: ${error.message || 'Error desconocido'}`);
        }
      });
    }
  }

  getStatusLabel(statusValue: string): string {
    const status = this.statusOptions.find(s => s.value === statusValue);
    return status ? status.label : statusValue;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'processing':
      case 'roasting':
      case 'cooling':
      case 'packaging': return 'status-processing';
      case 'ready': return 'status-ready';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  canCancelOrder(status: string): boolean {
    // Solo se pueden cancelar pedidos en ciertos estados
    return !['delivered', 'cancelled'].includes(status);
  }
}
