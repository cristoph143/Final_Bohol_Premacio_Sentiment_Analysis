import { Threads } from './../services/threads/threads-interface';
import { RepliesService } from './../services/replies/replies.service';
import { ThreadsService } from './../services/threads/threads.service';
import { Component, OnInit } from '@angular/core';
import { Reply } from '../services/replies/reply';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  replies: Reply[]=[];
  threads: Threads[]=[]
  pos: number[]=[]
  neg: number[]=[]
  neutral: number[]=[]
  total!: any;
  constructor(
    private crudThreads: ThreadsService,
    private crudReply: RepliesService,
  ) { }

  ngOnInit(): void {
    
    this.crudThreads.getThreads().subscribe((threads => {
      this.threads = threads;
      for(let i = 0; i < this.threads.length; i++){
        this.total = (this.threads[i].likes / this.threads[i].replies.length * 100).toFixed(2);
        this.pos.push(this.total)  
      }
      for(let i = 0; i < this.threads.length; i++){
        this.total =(this.threads[i].dislikes / this.threads[i].replies.length * 100).toFixed(2);
        this.neg.push(this.total)  
      }
      for(let i = 0; i < this.threads.length; i++){
        this.total = (this.threads[i].neutral / this.threads[i].replies.length * 100).toFixed(2);
        this.neutral.push(this.total)  
      }
    }))
    this.crudReply.getReplies().subscribe((replies => {
      this.replies = replies;
    }))
   
  
  }
  
}
