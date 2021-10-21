import { Component, OnInit, Input } from '@angular/core';

import Swal from 'sweetalert2';

// Models
import { User } from '../../models/user.model';

// Services
import { UsersService } from '../../services/users.service';

@Component({
	selector: 'app-user-tarjeta',
	templateUrl: './user-tarjeta.component.html',
	styleUrls: ['./user-tarjeta.component.css']
})
export class UserTarjetaComponent implements OnInit {
	@Input() user: User;

	constructor(private usersService: UsersService) {}

	ngOnInit(): void {}

	/**
	 * Método para eliminar un usuario.
	 * @param id id del usuario a eliminar
	 * @author Carlos Gómez
	 * @createdate 2021-10-20
	 */
	deleteUser(id): void {
		Swal.fire({
			title: '¿Estás seguro de eliminar al usuario?',
			text: 'Está acción sera definitiva y no se podrá deshacer.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#2CABBC',
			cancelButtonColor: '#DADADA',
			confirmButtonText: 'Aceptar',
			cancelButtonText: 'Cancelar',
			reverseButtons: true
		}).then((result) => {
			if (result.isConfirmed) {
				this.usersService.deleteUser(id).then(() => {
					Swal.fire({
						icon: 'success',
						title: '¡Felicidades!',
						text: 'Usuario eliminado satisfactoriamente.',
						showConfirmButton: false,
						timer: 3000
					});
				});
			}
		});
	}
}
