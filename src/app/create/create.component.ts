import { Router } from '@angular/router';
import { ThreadsService } from './../services/threads/threads.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Threads } from '../services/threads/threads-interface';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as moment from 'moment';
import { SentimentService } from '../services/sentiment/sentiment.service';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  message: String = "";
  imagePath: any;
  url: any;
  validImage: boolean = false;
  email!: string;
  constructor(
    private dialog: MatDialog,
    private toast: HotToastService,
    private fire: AngularFireAuth,
    private crudThread: ThreadsService,
    private router: Router,
    private sentiment: SentimentService
  ) { }

  addThreadForm: FormGroup = new FormGroup({
    threadTitle: new FormControl('', Validators.required),
    threadSub: new FormControl('', Validators.required),
    threadImage: new FormControl('', Validators.required),

  });
  

  closeDialog(){
    this.dialog.closeAll();
    this.addThreadForm.reset();
  }
  onFileChanged(event) {
    
    const files = event.target.files;
    if (files.length === 0)
      return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
      
      this.validImage = true;
    }
  }
  ngOnInit(): void {
    this.fire.authState.subscribe((user: any) => {
      this.email = user.email;
    })
  }
  clearImage(){
    this.imagePath = "";
    this.url = "";
    this.validImage = false;
    this.addThreadForm.reset();
  }
  onSubmitAdd(){
    if(!this.addThreadForm.valid){
      this.toast.error("Please fill all fields!");
      return;
    }
    const currDay = moment().format('MMMM Do YYYY, h:mm a');
    const payload: Threads = {
      $key: '',
      title: this.addThreadForm.value.threadTitle,
      subtitle: this.addThreadForm.value.threadSub,
      replies: [],
      postedBy: this.email,
      postedDate: currDay,
      likes: 0,
      dislikes: 0,
      neutral: 0,
      comments: 0,
      threadImage: this.url,
    }
    this.crudThread.addThreads(payload);
    this.addThreadForm.reset();
    this.toast.success("Thread Added Sucessfully!");
    this.dialog.closeAll();
    this.router.navigate(['/user-dashboard']);
  }
}
