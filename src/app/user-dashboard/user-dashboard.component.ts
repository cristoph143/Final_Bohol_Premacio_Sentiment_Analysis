import { RepliesComponent } from './../replies/replies.component';
import { Threads } from './../services/threads/threads-interface';
import { Router } from '@angular/router';
import { ThreadsService } from './../services/threads/threads.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  threads: Threads[]=[];
  constructor(
    private toast: HotToastService,
    private router: Router,
    private crudThreads: ThreadsService,
    private dialog: MatDialog,
  ) { }
  searchForm: FormGroup = new FormGroup({
    search: new FormControl('', Validators.required), 
  });
  ngOnInit(): void {
    this.crudThreads.getThreads().subscribe((threads: Threads[])=>{
      this.threads = threads;
      console.log(this.threads);
    })
  }
  showReplies(){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width =  "100%";
      this.dialog.open(RepliesComponent,dialogConfig);
    
  }

}
