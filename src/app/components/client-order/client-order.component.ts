import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { ClientOrderService, RoastingOrder } from '../../services/client-order.service';

@Component({
  selector: 'app-client-order',
  templateUrl: './client-order.component.html',
  styleUrls: ['./client-order.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class ClientOrderComponent implements OnInit {
  order: Partial<RoastingOrder> = {
    clientId: 0,
    clientName: '',
    coffeeType: '',
    quantity: 1,
    roastLevel: 'medium',
    specialInstructions: ''
  };

  coffeeTypes = [
    { value: 'arabica', label: 'Arábica' },
    { value: 'robusta', label: 'Robusta' },
    { value: 'blend', label: 'Mezcla Especial' }
  ];

  roastLevels = [
    { value: 'light', label: 'Suave' },
    { value: 'medium', label: 'Medio' },
    { value: 'dark', label: 'Intenso' },
    { value: 'custom', label: 'Personalizado' }
  ];

  orderSubmitted = false;
  orderSuccess = false;
  errorMessage = '';

  constructor(
    private usuarioService: UsuarioService,
    private clientOrderService: ClientOrderService
  ) {}

  ngOnInit(): void {
    const usuario = this.usuarioService.obtenerUsuarioActual();
    if (usuario) {
      this.order.clientId = usuario.id || 0;
      this.order.clientName = usuario.username;
    }
  }

  submitOrder(event: Event, form: NgForm): void {
    event.preventDefault();

    if (!form.valid) {
      this.errorMessage = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.orderSubmitted = true;
    this.errorMessage = '';

    // Usar el servicio para crear el pedido
    this.clientOrderService.createOrder(this.order as any).subscribe({
      next: (createdOrder) => {
        console.log('Pedido creado:', createdOrder);
        this.orderSuccess = true;
        // Reiniciar el formulario para un nuevo pedido
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al crear el pedido:', error);
        this.errorMessage = `Error al crear el pedido: ${error.message || 'Error desconocido'}`;
        this.orderSubmitted = false;
      }
    });
  }

  resetForm(): void {
    this.order = {
      clientId: this.order.clientId,
      clientName: this.order.clientName,
      coffeeType: '',
      quantity: 1,
      roastLevel: 'medium',
      specialInstructions: ''
    };
    this.orderSubmitted = false;
  }
}
