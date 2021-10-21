import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HomeRoutingModule } from './home-routing.module';
import { WelcomeComponent } from './components/welcome/welcome.component';

@NgModule({
	declarations: [WelcomeComponent],
	imports: [CommonModule, RouterModule, HomeRoutingModule]
})
export class HomeModule {}
