import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

// Updated with BehaviorSubject & other from 
// https://daily-dev-tips.com/posts/angular-authenticating-users-from-an-api/
export class AuthService {

  private userSubject: BehaviorSubject<User | null>;
  public userObj: Observable<User | null>;

  isAutheticated = false;

  constructor(private router: Router) {
    let data: any = '';
    if (localStorage.getItem('userData')) {
      data = localStorage.getItem('userData');
      this.userSubject = new BehaviorSubject<User | null>(
        JSON.parse(data)
      );
      this.isAutheticated = true;
    } else {
      this.userSubject = new BehaviorSubject<User | null>(null);
      this.isAutheticated = false;
    }

    this.userObj = this.userSubject.asObservable();
  }

  public getUserValue(): User | null {
    return this.userSubject.value;
  }

  login(user: User): User {
    localStorage.setItem('userData', JSON.stringify(user));
    this.userSubject.next(user);
    this.isAutheticated = true;

    return user;
    /*
    // Sending out the update to the all Subscibers, if a component needs this info, they should subscribe via a Subscription
    this.user$.next(user);

    this.isAutheticated = true;
    // localStorage.setItem('userData', JSON.stringify(user));
    // Check if user existed in our system.
    // Update the login status of the user in DB
    */
  }

  logout(): void {
    // Clear the contents from session
    sessionStorage.removeItem('ID:');
    sessionStorage.removeItem('Name:');
    localStorage.removeItem('ID');
    localStorage.removeItem('Name');
    localStorage.removeItem('ImageUrl');
    localStorage.removeItem('Email');

    localStorage.removeItem('userData');

    this.isAutheticated = false;
    // Get rid of saved instance of User
    this.userSubject.next(null);

    // Update the status on DB

    // Navigate back to Login page
    this.router.navigate(['']);
  }

  checkAuthentication(): boolean {
    console.log('checkAuthentication: isAuthenticated: ' +
      this.isAutheticated + ' User: ' + this.userSubject);
    if (this.isAutheticated) {
      return true;
    }

    if (this.getUserValue()) {
      console.log('checkAuthentication: Returning true, bcoz user exists' );
      this.isAutheticated = true;
      return true;
    }

    const data = localStorage.getItem('userData)');
    if (data) {
      console.log('checkAuthentication: Found userData in localStorage');
      const userObj: User = JSON.parse(data);
      this.isAutheticated = true;
      return true;
    }

    return false;
  }
}
