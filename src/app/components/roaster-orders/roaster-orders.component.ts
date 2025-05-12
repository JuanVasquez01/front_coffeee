import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { ClientOrderService, RoastingOrder, OrderStatusUpdate } from '../../services/client-order.service';

@Component({
  selector: 'app-roaster-orders',
  templateUrl: './roaster-orders.component.html',
  styleUrls: ['./roaster-orders.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class RoasterOrdersComponent implements OnInit {
  filteredOrders: RoastingOrder[] = [];
  selectedOrder: RoastingOrder | null = null;

  statusFilter: string = 'all';
  newStatus: string = '';
  statusNotes: string = '';

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

  updateSuccess: boolean = false;
  errorMessage: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private clientOrderService: ClientOrderService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.clientOrderService.getAllOrders().subscribe({
      next: (orders) => {
        console.log('Pedidos cargados:', orders);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error al cargar pedidos:', error);
        this.errorMessage = `Error al cargar pedidos: ${error.message}`;
      }
    });
  }

  applyFilters(): void {
    this.clientOrderService.filterAllOrdersByStatus(this.statusFilter).subscribe({
      next: (filteredOrders) => {
        this.filteredOrders = filteredOrders;
      },
      error: (error) => {
        console.error('Error al filtrar pedidos:', error);
        this.errorMessage = `Error al filtrar pedidos: ${error.message}`;
        this.filteredOrders = [];
      }
    });
  }

  viewOrderDetails(order: RoastingOrder): void {
    this.clientOrderService.getOrder(order.id!).subscribe({
      next: (orderDetails) => {
        this.selectedOrder = orderDetails;
        this.newStatus = '';
        this.statusNotes = '';
        this.updateSuccess = false;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error al obtener detalles del pedido:', error);
        this.errorMessage = `Error al obtener detalles del pedido: ${error.message}`;
      }
    });
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
    this.updateSuccess = false;
    this.errorMessage = '';
  }

  updateOrderStatus(): void {
    if (!this.selectedOrder || !this.newStatus) {
      this.errorMessage = 'Por favor seleccione un nuevo estado';
      return;
    }

    this.clientOrderService.updateOrderStatus(this.selectedOrder.id!, this.newStatus, this.statusNotes).subscribe({
      next: (updatedOrder) => {
        console.log('Pedido actualizado:', updatedOrder);
        this.selectedOrder = updatedOrder;
        this.updateSuccess = true;
        this.errorMessage = '';

        // Recargar la lista de pedidos
        this.applyFilters();

        // Limpiar campos
        this.newStatus = '';
        this.statusNotes = '';

        // Ocultar mensaje de éxito después de un tiempo
        setTimeout(() => {
          this.updateSuccess = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error al actualizar estado del pedido:', error);
        this.errorMessage = `Error al actualizar estado: ${error.message}`;
        this.updateSuccess = false;
      }
    });
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

  getAvailableStatusTransitions(currentStatus: string): {value: string, label: string}[] {
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

    const availableTransitions = validTransitions[currentStatus] || [];
    return this.statusOptions.filter(option =>
      availableTransitions.includes(option.value)
    );
  }
}
