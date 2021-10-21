import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare let bootstrap: any;

import { Modal } from 'bootstrap';

import Swal from 'sweetalert2';

import { AngularFireStorage } from '@angular/fire/storage';

// Models
import { User } from '../../models/user.model';

// Services
import { UsersService } from '../../services/users.service';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
	selector: 'app-users-list',
	templateUrl: './users-list.component.html',
	styleUrls: ['./users-list.component.css'],
	providers: [AngularFireStorage]
})
export class UsersListComponent implements OnInit, OnDestroy {
	loading: boolean = false; // Variable para saber cuando se están cargando los datos.
	users: User[] = []; // Variable para almacenar los juegos existentes.

	formSearch: FormGroup;

	formInformacion: FormGroup; // Formulario para almacenar la información.

	private ngUnsubscribe: Subject<any> = new Subject<any>(); // Observable para desubscribir todos los observables

	// Para trabajar con la imagen
	uploadPercent: Observable<number>;
	urlImage: Observable<string>;
	nameImageUp: string;

	modal: Modal | undefined;
	userSelected: User = null;

	constructor(private fb: FormBuilder, private usersService: UsersService, private storage: AngularFireStorage) {
		this.formSearch = this.fb.group({
			search: ['', [Validators.required]]
		});
		this.formInformacion = this.fb.group({
			name: [null, [Validators.required]],
			lastName: [null, [Validators.required]],
			status: [null, [Validators.required]],
			photo: [null, []],
			haveBrothers: [null, [Validators.required]],
			birthDate: [null, [Validators.required]]
		});
	}

	ngOnInit(): void {
		this.getAllUsers();
	}

	/**
	 * Método para obtener todos los usuarios almacenados en Firebase.
	 */
	getAllUsers(): void {
		this.usersService
			.getUsers()
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((resp) => {
				this.users = resp;
			});
	}

	/**
	 * Método que se ejecuta cuando se busca una sala por ID.
	 */
	search(): void {
		this.loading = true;
		this.usersService.getUsersByFilter(this.formSearch.value.search).subscribe((users) => {
			this.users = users;
			this.loading = false;
		});
	}

	saveUser(): void {
		let user;
		if (this.urlImage) {
			this.urlImage.subscribe((url) => {
				this.formInformacion.controls.photo.setValue(url);
				user = {
					...this.formInformacion.value,
					status: parseInt(this.formInformacion.value.status, 10),
					userId: this.userSelected?.userId
				};
				this.saveUserFirebase(user);
			});
		} else {
			user = { ...this.formInformacion.value, status: parseInt(this.formInformacion.value.status, 10), userId: this.userSelected?.userId };
			this.saveUserFirebase(user);
		}
	}

	saveUserFirebase(user: User): void {
		if (this.userSelected) {
			this.usersService.updateUser(user).then(() => {
				Swal.fire({
					icon: 'success',
					title: '¡Felicidades!',
					text: 'Usuario actualizado con éxito.',
					showConfirmButton: false,
					timer: 3000
				});
			});
		} else {
			delete user.userId;
			this.usersService.addUser(user).then(() => {
				Swal.fire({
					icon: 'success',
					title: '¡Felicidades!',
					text: 'Usuario creado satisfactoriamente.',
					showConfirmButton: false,
					timer: 3000
				});
			});
		}
	}

	/**
	 * Método para obtener toda la información de la imagen a cargar a Firestore
	 * @param e evento que se activa al seleccion una imagen
	 */
	onUpload(e): void {
		const id = Math.random().toString(36).substring(2);
		const file = e.target.files[0];
		if (file) {
			this.nameImageUp = file.name;
		}
		const filePath = `img/profile_${id}`;
		const ref = this.storage.ref(filePath);
		const task = this.storage.upload(filePath, file);
		this.uploadPercent = task.percentageChanges();
		task
			.snapshotChanges()
			.pipe(finalize(() => (this.urlImage = ref.getDownloadURL())))
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe();
	}

	closeModal(): void {
		this.formInformacion.reset();
		// Reiniciamos las variables de las imagenes
		this.urlImage = null;
		this.nameImageUp = null;
		this.userSelected = null;
	}

	viewUser(event: User): void {
		this.userSelected = event;
		this.modal = new bootstrap.Modal(document.getElementById('exampleModal'), {
			keyboard: false
		});

		this.formInformacion.controls.name.setValue(event.name);
		this.formInformacion.controls.lastName.setValue(event.lastName);
		this.formInformacion.controls.status.setValue(event.status);
		this.formInformacion.controls.haveBrothers.setValue(event.haveBrothers);
		this.formInformacion.controls.birthDate.setValue(event.birthDate);
		this.formInformacion.controls.photo.setValue(event.photo);

		this.modal.show();
	}

	/**
	 * Este metodo se ejecuta cuando el componente se destruye
	 * Usamos este método para cancelar todos los observables.
	 */
	ngOnDestroy(): void {
		// End all subscriptions listening to ngUnsubscribe
		// to avoid memory leaks.
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
