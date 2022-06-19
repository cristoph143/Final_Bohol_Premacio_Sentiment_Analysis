import { Frequency } from './frequency';
import { ScoreFrequencyService } from './../score/score-frequency.service'
import { RepliesService } from './../replies/replies.service';

import { Injectable } from '@angular/core';
import { Reply } from '../replies/reply';

@Injectable({
  providedIn: 'root'
})
export class SentimentService {
frequency: Frequency[]=[];
finalFrequency: Frequency[]=[];
replies: Reply[]=[];
  constructor(
    private crudReplies: RepliesService,
    private crudScore: ScoreFrequencyService,
  ) { }

  addToFrequency(){
    let sw: any, ex: any, payload: Frequency, pos: number = 0, neg: number = 0, j = 0;
    this.frequency.length = 0;
    this.crudReplies.getReplies().subscribe(((replies: Reply[]) =>{
      this.replies = replies;
      for(let i = 0; i < this.replies.length; i++ ){
        let outString = this.replies[i].reply.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');  
         sw = require('sentiword');
         ex = sw(outString);
         for(let i = 0; i < ex.words.length; i++){
          payload = {
           keyword: ex.words[i].SynsetTerms,
           positive: ex.words[i].PosScore,
           negative: ex.words[i].NegScore,
          }
          if(payload.positive > payload.negative){
            payload.positive = 1;
            if(payload.negative != 0){
              payload.negative = 0;
            }
          }else{
            payload.negative = 1;
            if(payload.positive != 0){
              payload.positive = 0;
            }
          }
          
          this.frequency.push(payload);
         } 
      }//end for
      
      console.log("FREQ: ",this.frequency);
      this.cleanFrequency(this.frequency);
    }))//end subscribe
  }//end method
  cleanFrequency(frequency: Frequency[]){
    let newArr = [frequency[0]]
    for(let i = 1; i < frequency.length; i++){
      
    }
    console.log("NEW FREQ: ", newArr);
  }//end method
}
