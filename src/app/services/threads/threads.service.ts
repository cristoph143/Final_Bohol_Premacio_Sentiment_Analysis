import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subject } from 'rxjs';
import { Threads } from './threads-interface';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

import { arrayRemove, FieldValue} from 'firebase/firestore';
@Injectable({
  providedIn: 'root'
})
export class ThreadsService {
  private threadCollection!: AngularFirestoreCollection<Threads>;
  threads!: Observable<Threads[]>;
  constructor(
    private afs: AngularFirestore, 
    private afAuth: AngularFireAuth,
  ) {
    this.threadCollection = this.afs.collection<Threads>('threads');
    this.threads = this.threadCollection.snapshotChanges().pipe(//basically just to get the id from collection katong random ass numbers
      map((changes: any[]) =>{
        return changes.map(a => {
          const data = a.payload.doc.data() as Threads;
          data.$key = a.payload.doc.id;
          return data;
        });
      }));
   }

  addThreads(threads: Threads){
    const pushkey = this.afs.createId();
    threads.$key = pushkey;
    this.threadCollection.doc(pushkey).set(threads);
  }
  getThreads(){
    return this.threads;
  }
  modifyThreads(threadID: string, thread: Threads) { //get all the changes on the item and update
    this.threadCollection.doc(threadID).update(thread);
  }

}
