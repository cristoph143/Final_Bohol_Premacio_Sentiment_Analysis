import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {from} from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private firebaseAuth: AngularFireAuth,
  ) { }

  login(email: string, password: string){
    return  from(this.firebaseAuth.signInWithEmailAndPassword(email,password))
  }
  logout(){
    return from(this.firebaseAuth.signOut());
}
  register(email: string, password: string){
    return from(this.firebaseAuth.createUserWithEmailAndPassword(email,password))
}
}
