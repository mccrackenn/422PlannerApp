import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$ = new Subject<User>();
  isAutheticated = false;

  constructor(
    private router: Router
  ) { }


  login(user: User): void {
    // Sending out the update to the all Subscibers, if a component needs this info, they should subscribe via a Subscription
    this.user$.next(user);

    this.isAutheticated = true;
    localStorage.setItem('userData', JSON.stringify(user));
    // Check if user existed in our system.
    // Update the login status of the user in DB
  }

  logout(): void {
    // Clear the contents from session
    sessionStorage.removeItem('ID:');
    sessionStorage.removeItem('Name:');

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
}
