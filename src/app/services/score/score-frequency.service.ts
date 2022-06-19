import { SentimentScore } from './score';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScoreFrequencyService {
  private scoreCollection!: AngularFirestoreCollection<SentimentScore>;
  scores!: Observable<SentimentScore[]>;
  constructor(
    private afs: AngularFirestore, 
  ) { 
    this.scoreCollection = this.afs.collection<SentimentScore>('scores');
    this.scores = this.scoreCollection.snapshotChanges().pipe(//basically just to get the id from collection katong random ass numbers
      map((changes: any[]) =>{
        return changes.map(a => {
          const data = a.payload.doc.data() as SentimentScore;
          data.$key = a.payload.doc.id;
          return data;
        });
      }));
  }
  addScores(scores: SentimentScore){
    const pushkey = this.afs.createId();
    scores.$key = pushkey;
    this.scoreCollection.doc(pushkey).set(scores);
  }
  getScores(){
    return this.scores;
  }
  modifyScores(scoreID: string, score: SentimentScore) { //get all the changes on the item and update
    this.scoreCollection.doc(scoreID).update(score);
  }
  
}
