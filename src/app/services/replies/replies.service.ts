import { Observable } from 'rxjs';
import { Injectable, ApplicationRef } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { Reply } from './reply';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { Threads } from '../threads/threads-interface';
import { ThreadsService } from '../threads/threads.service';

@Injectable({
  providedIn: 'root'
})
export class RepliesService {
  private replyCollecton!: AngularFirestoreCollection<Reply>;
  replies!: Observable<Reply[]>;
  constructor(
    private crudThreads: ThreadsService,
    private afs: AngularFirestore, 
    private cdr: ApplicationRef,
  ) { 
    this.replyCollecton = this.afs.collection<Reply>('replies', ref => ref.orderBy('repliedDate', 'desc'));
    this.replies = this.replyCollecton.snapshotChanges().pipe(//basically just to get the id from collection katong random ass numbers
      map((changes: any[]) =>{
        return changes.map(a => {
          const data = a.payload.doc.data() as Reply;
          data.$key = a.payload.doc.id;
          this.cdr.tick();
          return data;
        });
      }));
  }
  addReplies(replies: Reply){
    const pushkey = this.afs.createId();
    replies.$key = pushkey;
    this.replyCollecton.doc(pushkey).set(replies);
  }
  getReplies(){
    return this.replies;
  }
  modifyReplies(replyID: string, reply: Reply) { //get all the changes on the item and update
    this.replyCollecton.doc(replyID).update(reply);
  }

  delRep(uid: any, thread: Threads, sentAnal: any, reply: any){
    let i = 0;
    this.replyCollecton.doc(uid).delete();
    if(sentAnal == 'Positive'){
      thread.likes = thread.likes - 1;
    } else if(sentAnal == "Negative"){
      thread.dislikes = thread.dislikes - 1;
    } else if(sentAnal == "Neutral"){
      thread.neutral = thread.neutral - 1;
    }
    for(i = 0; i < thread.replies.length; i++){
      if (thread.replies[i] == reply){
        thread.replies.splice(i, 1);
      }
    }
  this.crudThreads.modifyThreads(thread.$key,thread);
}

}