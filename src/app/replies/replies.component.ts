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
import { Anal } from '../services/sentiment/frequency';


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
  getString!: string;
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
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.getThreadData = this.crudThreads.passThreadValues$;
    this.getThreadData.subscribe((threads: Threads) =>{
      this.threads = threads;
    })
   }
  ngOnInit(): void {
    this.fire.authState.subscribe((user: any) => {
      this.email = user.email;
    },
    )
    this.getReplies();
    this.showDelete();
  }
   getReplies(){
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
     let i: number
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
    
    // payload.sentAnal = this.sentiment.preProcessing(payload.reply);
    threads.replies.push(this.addReply.value.replyString);
    this.crudThreads.modifyThreads(threads.$key, threads);
    this.toast.success("Reply Added!");
    // this.sentiment.check(payload.reply,threads,this.replies);
    // this.crudReply.addReplies(payload);
    this.crudReply.getReplies().subscribe((reply: Reply[]) => {
      this.replies.length = 0;
    for(i  = 0; i < reply.length; i++){
      if(reply[i].threadID == this.threads.$key){
        this.replies.push(reply[i]);
      }
      
     }
    ;
    
    //  this.crudReply.modifyReplies(this.replies[i].$key,payload);
    })//end subscribe
    this.sentiment.addToFrequency(payload);
    payload.sentAnal = this.sentiment.getNaiveBayes(payload.reply,threads)
    this.crudReply.addReplies(payload);
    
    
    // this.sentiment.addToFrequency(this.replies);
    // 
  
    this.addReply.reset(); 
    // console.log(payload.sentAnal); 
  }

  isDelete = false;
  // if current user is equal to the user who created the thread, then delete button is shown
  showDelete(){
    this.fire.authState.subscribe((user: any) => {
      user.email;
      console.log(user.email)
      console.log(this.threads.postedBy)

      if(this.threads.postedBy == user.email){
        // this.crudThreads.deleteThread(thread.$key);
        console.log(this.threads.postedBy + " <==> " + user.email)
        this.isDelete = true;
      }
    })
  }

  deleteThread(){
    if(confirm("Are you sure to delete "+this.threads.title+"?")){ 
      this.crudThreads.deleteThread(this.threads.$key);
      this.toast.success("Thread Deleted Successfully!");
    }
  }
  delReply(i: any){
    if(confirm("Are you sure to delete your your reply? ")){ 
      this.crudReply.delRep(this.replies[i].$key, this.threads, this.replies[i].sentAnal, this.replies[i].reply)
      this.getReplies();
      this.toast.success("Reply Deleted Successfully!");
    }
  }
  setString(data){
    this.getString = data;
  }
  // 
}
