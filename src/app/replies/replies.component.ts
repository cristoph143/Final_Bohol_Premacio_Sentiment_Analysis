import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Reply } from './../services/replies/reply';
import { Subject } from 'rxjs';
import { Threads } from './../services/threads/threads-interface';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { ThreadsService } from './../services/threads/threads.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RepliesService } from '../services/replies/replies.service';
import * as moment from 'moment';
@Component({
  selector: 'app-replies',
  templateUrl: './replies.component.html',
  styleUrls: ['./replies.component.css']
})
export class RepliesComponent implements OnInit {
  email!: any;
  threads!: Threads;
  replies: Reply[]=[];
  getThreadData!: Subject<Threads>;
  addReply: FormGroup = new FormGroup({
    replyString: new FormControl('', Validators.required),
  });
  constructor(
    private crudThreads: ThreadsService,
    private toast: HotToastService,
    private dialog: MatDialog,
    private crudReply: RepliesService,
    private router: Router,
    private fire: AngularFireAuth,
  ) {
    this.getThreadData = this.crudThreads.passThreadValues$;
    this.getThreadData.subscribe((threads: Threads) =>{
      this.threads = threads;
    })
   }
  ngOnInit(): void {
    this.fire.authState.subscribe((user: any) => {
      this.email = user.email;
    })
    this.getReplies();
  }
  getReplies(){
    this.replies.length = 0;
    this.crudReply.getReplies().subscribe((reply: Reply[]) => {
    for(let i  = 0; i < reply.length; i++){
      if(reply[i].threadID == this.threads.$key){
        this.replies.push(reply[i]);
      }
     }
    //  sort the reply by early dates first
    // this.replies.sort((a, b) => {
    //   return moment(a.repliedDate).diff(moment(b.repliedDate));
    // });
      console.log(this.replies);
    })
  }
  onSubmitReply(threads: Threads){
    if(!this.addReply.valid){
      this.toast.error("Add your reply first!");
      return;
    }
    const currDay =  moment().format('MMMM Do YYYY, h:mm a');
    const payload: Reply = {
      $key: '',
      reply: this.addReply.value.replyString,
      repliedBy: this.email,
      repliedDate: currDay,
      likes: 0,
      dislikes: 0,
      threadID: threads.$key,
    }
    threads.replies.push(this.addReply.value.replyString);
    this.crudThreads.modifyThreads(threads.$key, threads);
    this.toast.success("Reply Added!");
    this.crudReply.addReplies(payload);  
  }
  // 
}
