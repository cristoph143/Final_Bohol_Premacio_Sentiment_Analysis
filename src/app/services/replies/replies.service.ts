import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { Reply } from './reply';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RepliesService {
  private replyCollecton!: AngularFirestoreCollection<Reply>;
  replies!: Observable<Reply[]>;
  constructor(
    private afs: AngularFirestore, 
    private afAuth: AngularFireAuth,
  ) { 
    this.replyCollecton = this.afs.collection<Reply>('replies');
    this.replies = this.replyCollecton.snapshotChanges().pipe(//basically just to get the id from collection katong random ass numbers
      map((changes: any[]) =>{
        return changes.map(a => {
          const data = a.payload.doc.data() as Reply;
          data.$key = a.payload.doc.id;
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
}
