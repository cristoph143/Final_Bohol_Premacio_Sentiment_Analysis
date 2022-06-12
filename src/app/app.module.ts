import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { HotToastModule } from '@ngneat/hot-toast';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
//firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
//end firebase
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HotToastModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    AngularFirestoreModule, 
    AngularFireAuthModule, 
    AngularFireStorageModule,
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
