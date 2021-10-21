import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

// Para trabajar con Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';

// Módulos creados
import { SharedModule } from './shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		RouterModule,
		AppRoutingModule,
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFirestoreModule, // imports firebase/firestore, only needed for database features
		AngularFireDatabaseModule,
		SharedModule,
		NoopAnimationsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
