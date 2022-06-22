import { StatisticsComponent } from './statistics/statistics.component';
import { RepliesComponent } from './replies/replies.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HotToastModule } from '@ngneat/hot-toast';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LoginComponent,
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
  },
  {
    path: 'navbar',
    component: NavbarComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'replies',
    component: RepliesComponent,
  },
  {
    path: 'stats',
    component: StatisticsComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
