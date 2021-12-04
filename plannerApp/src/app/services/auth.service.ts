import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Note } from '../models/note';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$ = new Subject<User>();
  isAutheticated = false;
  user!:User

  constructor(
    private router: Router,
    private httpClient:HttpClient,
  ) { }


  login(user: User): void {
    console.log(user)
    // Sending out the update to the all Subscibers, if a component needs this info, they should subscribe via a Subscription
    this.httpClient.get<User>('http://localhost:3000/api/users/'+user.email).pipe(
      map((user) => {
         user._id=user._id
        return user
      }),tap(result => this.user=result)
    ).subscribe(result => this.user$.next(result))
      console.log('sent update out')
    this.isAutheticated = true;
    //localStorage.setItem('userData', JSON.stringify(user));
    // Check if user existed in our system.
    // Update the login status of the user in DB
  }

  logout(): void {
    // Clear the contents from session
    // sessionStorage.removeItem('ID:');
    // sessionStorage.removeItem('Name:');
    localStorage.removeItem('ID');
    localStorage.removeItem('Name');
    localStorage.removeItem('ImageUrl');
    localStorage.removeItem('Email');

    localStorage.removeItem('userData');

    this.isAutheticated = false;
    // Get rid of saved instance of User
    this.user$.next(undefined);

    // Update the status on DB

    // Navigate back to Login page
    this.router.navigate(['']);
  }

  checkAuthentication(): boolean {
    if (this.isAutheticated) {
      return true;
    }
    if (this.user$ !== undefined) {
      this.isAutheticated = true;
      return true;
    }

    // const id = sessionStorage.getItem('ID');
    // console.log('Id from SS: ' + id);
    // if (id) {
    const data = localStorage.getItem('userData)');
      if (data) {
        const userObj: User = JSON.parse(data);
        // this.user$.next(userObj);
        this.isAutheticated = true;
        return true;
      }
    // }

    return false;
  }

  getCurrentUser():User{
    return this.user;
  }
}
