import { SentimentService } from './../services/sentiment/sentiment.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Reply } from './../services/replies/reply';
import { Subject } from 'rxjs';
import { Threads } from './../services/threads/threads-interface';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { ThreadsService } from './../services/threads/threads.service';
import { Component, OnInit, ChangeDetectorRef, ApplicationRef } from '@angular/core';
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
  currentID: any;
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
    private sentiment: SentimentService,
    private cdr: ApplicationRef
    
  ) {
    this.getThreadData = this.crudThreads.passThreadValues$;
    this.getThreadData.subscribe((threads: Threads) =>{
      this.threads = threads;
    })
   }
  ngOnInit(): void {
    this.fire.authState.subscribe((user: any) => {
      this.email = user.email;
      this.getReplies();
      this.sentiment.addToFrequency();
    },
    )
   
  }
  async getReplies(){
    await new Promise(f => setTimeout(f, 100));
    
    this.crudReply.getReplies().subscribe((reply: Reply[]) => {
      this.replies.length = 0;
    for(let i  = 0; i < reply.length; i++){
      if(reply[i].threadID == this.threads.$key){
        this.replies.push(reply[i]);
      }
     }
     
    })
  }
  async onSubmitReply(threads: Threads){
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
    
    this.sentiment.check(payload.reply);
    // payload.sentAnal = this.sentiment.preProcessing(payload.reply);
    threads.replies.push(this.addReply.value.replyString);
    this.crudThreads.modifyThreads(threads.$key, threads);
    this.toast.success("Reply Added!");
    this.sentiment.addToFrequency();
    
    payload.sentAnal = this.sentiment.getNaiveBayes(payload.reply,threads);
    this.crudReply.addReplies(payload); 
    this.addReply.reset(); 
    // console.log(payload.sentAnal); 
  }
  delReply(i: any){
    this.crudReply.delRep(this.replies[i].$key, this.threads, this.replies[i].sentAnal, this.replies[i].reply)
    this.getReplies();
    this.toast.success("Reply Deleted!");
  }
  // 
}
