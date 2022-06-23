import { ThreadsService } from './../threads/threads.service';
import { Threads } from './../threads/threads-interface';
import { Frequency, Anal } from './frequency';
import { ScoreFrequencyService } from './../score/score-frequency.service'
import { RepliesService } from './../replies/replies.service';

import { Injectable, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { Reply } from '../replies/reply';

@Injectable({
  providedIn: 'root'
})
export class SentimentService {
frequency: Frequency[]=[];
finalFrequency: Frequency[]=[];
found: boolean = false;
replyFrom: Reply[]=[];
getString! : Anal
negationWord: string[] = [];
intensifier: string[] = [];
downtoners: string[] = [];
// replies: Reply[]=[];
  constructor(
    private crudReplies: RepliesService,
    private crudScore: ScoreFrequencyService,
    private cdr: ApplicationRef,
    private crudThread: ThreadsService
  ) { }
  check(reply: string){
    let sw = require('sentiword');
    let ex = sw(reply);
    console.log("REPLY SENTIWOR: ",ex);
    
  }
    
  // }
   addToFrequency(replies: Reply){
    let sw: any, ex: any, payload: Frequency;
    const seen = new Set(); 
        let outString = replies.reply.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');  
         sw = require('sentiword');
         ex = sw(outString);
         for(let i = 0; i < ex.words.length; i++){
          payload = {
           keyword: ex.words[i].SynsetTerms,
           positive: ex.words[i].PosScore,
           negative: ex.words[i].NegScore,
          }
          // this.cleanFrequency(payload,this.frequency);
          if(payload.positive > payload.negative){
            payload.positive = 1;
            payload.negative = 0;
          }else if(payload.positive < payload.negative){
            payload.negative = 1;
            payload.positive = 0;
          }else{
            payload.negative = 0;
            payload.positive = 0;
          }
          this.frequency.push(payload);
         } 
      //end for
      const filteredArr = this.frequency.filter(el => {
        const duplicate = seen.has(el.keyword);
        seen.add(el.keyword);
        return !duplicate;
      });
        this.finalFrequency = this.cleanFrequency(this.frequency,filteredArr);
        ////START///
        ///EDN////
        
   
  }//end method
  cleanFrequency(frequency: Frequency[],unique: Frequency[]){
    
    let count: number = 0;
    for(let i = 0; i < unique.length; i++){
      for(let j = 0; j < frequency.length; j++){
        if(unique[i].keyword == frequency[j].keyword){
          if(count >= 1){
            unique[i].positive = unique[i].positive + frequency[j].positive;
            unique[i].negative = unique[i].negative + frequency[j].negative;
          }
          count++;
        }
      } 
      count = 0;
    }
    this.cdr.tick();
    return unique;
  }//end method
  getNaiveBayes(reply: string, thread: Threads){
    let sentAnalysis: string;
    let totalPositive: number = 0, totalNegative: number = 0;
    let outString = reply.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''); 
    let token = outString.split(" ",outString.length);
    let positive: number[]=[], negative: number[]=[];
    let totalProbPositive: number = 0, totalProbNegative: number = 0;
    this.negationWord = ["not", "n't", "never", "none", "nothing", "no", "neither", "nowhere", "never", "nope",
      "can't", "couldn't", "didn't", "doesn't", "don't", "hadn't", "hasn't", "haven't", "isn't", "mayn't",
      "mightn't", "mustn't", "needn't", "oughtn't", "shan't", "shouldn't", "wasn't", "weren't", "won't", "wouldn't"];
    // list all intensifier and save it to this.intensifier
    this.intensifier = ["very","always", "extremely", "absolutely", "totally", "tremendously", "totally"];
    // list all downtoners and save it to this.downtoners
    this.downtoners = ["quite", "very", "pretty"]
    // loop the finalFrequency and get the keyword
    for(let i = 0; i < this.finalFrequency.length; i++){
      
      // match this.finalFrequency[i].keyword with the negationWord
      if(this.negationWord.includes(this.finalFrequency[i].keyword)){
        this.finalFrequency[i].negative += 1;
      }
      else if(this.intensifier.includes(this.finalFrequency[i].keyword) ||
        this.downtoners.includes(this.finalFrequency[i].keyword)){
          this.finalFrequency[i].positive += 1;
        }
      //check for total positive and negative//
      totalPositive = totalPositive + this.finalFrequency[i].positive;
      totalNegative = totalNegative + this.finalFrequency[i].negative;
      
    }
    //end check for total positive and negative//
    //check for positive probability//
     console.log("FREQ DICT",this.finalFrequency);
    for(let i = 0; i < token.length; i++){
      for(let j = 0; j < this.finalFrequency.length; j++){
        if(token[i] == this.finalFrequency[j].keyword){
          if(this.finalFrequency[j].positive / totalPositive != 0){
            positive.push(this.finalFrequency[j].positive / totalPositive);
          }
        }
      }
    } //end check for positive probability//
   
    console.log("For Positive Prob: ",positive);
    //check for negative probability//
    for(let i = 0; i < token.length; i++){
      for(let j = 0; j < this.finalFrequency.length; j++){
        if(token[i] == this.finalFrequency[j].keyword){
          if(this.finalFrequency[j].negative / totalNegative != 0){
            negative.push(this.finalFrequency[j].negative / totalNegative);
          }
        }
      }
    }  //end check for negative probability//
    console.log("For Negative Prob: ",negative);
    totalProbNegative = negative[0];
    totalProbPositive = positive[0];
    for(let i = 1; i < negative.length; i++){
    totalProbNegative = totalProbNegative * negative[i];
    }
    for(let i = 1; i < positive.length; i++){
      totalProbPositive = totalProbPositive * positive[i];
    }
    if(totalProbPositive == undefined || Number.isNaN(totalProbPositive))
      totalProbPositive = 0
    if(totalProbNegative == undefined || Number.isNaN(totalProbNegative))
      totalProbNegative = 0
    console.log("FINAL PROB POSITIVE: ", totalProbPositive);
    console.log("FINAL PROB NEGATIVE: ", totalProbNegative);
    if(totalProbPositive > totalProbNegative){
      sentAnalysis = "Positive"
    }else if(totalProbPositive < totalProbNegative){
      sentAnalysis = "Negative"
    }else
      sentAnalysis = "Neutral"
    
    //update thread
    if(sentAnalysis == "Positive"){
      thread.likes = thread.likes + 1;
    }
    if(sentAnalysis == "Negative"){
      thread.dislikes = thread.dislikes + 1;
    }
    if(sentAnalysis == "Neutral"){
      thread.neutral = thread.neutral + 1;
    }
    this.crudThread.modifyThreads(thread.$key,thread);
    //end update thread
    
    return sentAnalysis;
    
  } // end method
  
}
