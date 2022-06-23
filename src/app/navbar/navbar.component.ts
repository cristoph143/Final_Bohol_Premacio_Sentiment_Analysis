import { CsvComponent } from './../csv/csv.component';
import { CreateComponent } from './../create/create.component';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }
  logout(){
    this.authService.logout().subscribe(()=>{
      this.router.navigate(['/login']);
    })
  }
  showAdd(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width =  "60%";
    this.dialog.open(CreateComponent,dialogConfig);
  } 
  showCSV(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width =  "60%";
    this.dialog.open(CsvComponent,dialogConfig);
  }

}
