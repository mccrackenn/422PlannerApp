import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$ = new Subject<User>();

  constructor(
    private router:Router
  ) { }


  login(user:User){
    //Sending out the update to the all Subscibers, if a component needs this info, they should subscribe via a Subscription
    this.user$.next(user);


  }
}
