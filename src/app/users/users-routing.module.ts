import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { UsersListComponent } from './components/users-list/users-list.component';

const routes: Routes = [
	{ path: '', component: UsersListComponent },
	{ path: 'list', component: UsersListComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UsersRoutingModule {}
