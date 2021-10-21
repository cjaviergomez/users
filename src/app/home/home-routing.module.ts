import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
	{ path: '', component: WelcomeComponent },
	{ path: 'home', component: WelcomeComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HomeRoutingModule {}
