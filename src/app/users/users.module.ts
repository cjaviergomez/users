import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users-routing.module';

// Componentes
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserTarjetaComponent } from './components/user-tarjeta/user-tarjeta.component';
import { PhotoPipe } from './pipes/photo.pipe';

@NgModule({
	declarations: [UsersListComponent, UserTarjetaComponent, PhotoPipe],
	imports: [CommonModule, ReactiveFormsModule, UsersRoutingModule]
})
export class UsersModule {}
