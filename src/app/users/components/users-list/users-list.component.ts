import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
	search() {
		// if (this.formSearch.invalid) {
		// 	this.getAllGames();
		// 	return;
		// }
		// this.gameService
		// 	.getGame(this.formSearch.value.id)
		// 	.pipe(takeUntil(this.ngUnsubscribe))
		// 	.subscribe((game) => {});
	}

	saveUser(): void {
		console.log(this.formInformacion);
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
