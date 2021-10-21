import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

// Models
import { User } from '../models/user.model';

@Injectable({
	providedIn: 'root'
})
export class UsersService {
	private usersCollection: AngularFirestoreCollection<User>;
	private userDoc: AngularFirestoreDocument<User>;
	private users: Observable<User[]>;
	private user: Observable<User>;

	constructor(private afs: AngularFirestore) {}

	/**
	 * Método para obtener todos los usuarios almacenadas en la base de datos de firebase.
	 * @author Carlos Gómez
	 * @createdate 2021-10-20
	 */
	getUsers(): Observable<User[]> {
		this.usersCollection = this.afs.collection<User>('users');
		return (this.users = this.usersCollection.snapshotChanges().pipe(
			map((changes) => {
				return changes.map((action) => {
					const data = action.payload.doc.data() as User;
					data.userId = action.payload.doc.id;
					return data;
				});
			})
		));
	}

	/**
	 * Método para agregar un nuevo usuario a la base de datos.
	 * @author Carlos Gómez
	 * @createdate 2021-10-20
	 */
	addUser(user: User): Promise<any> {
		this.usersCollection = this.afs.collection<User>('users');
		return this.usersCollection.add(user);
	}

	/**
	 * Método para obtener un usuario especifico de Firebase.
	 * @param id id del usuario a obtener
	 * @author Carlos Gómez
	 * @createdate 2021-10-20
	 */
	getUser(id: string): Observable<User> {
		this.userDoc = this.afs.doc<User>(`users/${id}`); // Ruta del usuario en particular en firebase.
		return (this.user = this.userDoc.snapshotChanges().pipe(
			map((action) => {
				if (action.payload.exists == false) {
					return null;
				} else {
					const data = action.payload.data() as User;
					data.userId = action.payload.id;
					return data;
				}
			})
		));
	}

	/**
	 * Método para actualizar la informaciòn de un usurio en Firebase.
	 * @param user usuario a actualizar.
	 * @author Carlos Gómez
	 * @createdate 2021-10-20
	 */
	updateUser(user: User): Promise<void> {
		const idUser = user.userId;
		delete user.userId; // Le borramos el id al usuario para cuando lo vuelva a guardar no lo incluya dentro de sus atributos actualizados.
		return this.afs.collection<User>('users').doc(idUser).set(user);
	}

	/**
	 * Método para borrar a un usuario de la base de datos de firebase.
	 * @param id id del usuario a eliminar
	 * @author Carlos Gómez
	 * @createdate 2021-10-20
	 */
	deleteUser(id: string): Promise<void> {
		this.userDoc = this.afs.doc<User>(`users/${id}`);
		return this.userDoc.delete();
	}
}
