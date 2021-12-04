import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  template: ` <signin></signin> `,
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {
    //console.clear();
    //console.log(userLoggedIn);
  }

  ngOnInit() {
    const checkForLoggedInUser = localStorage.getItem('ID'); //checks localStorage if we have a user
    if (checkForLoggedInUser) {
      //There is a user saved, get that user and save to Object, alert the whole App by calling AuthService, passing userObject
      console.log('User detected');
      const newUser= new User(
        "",
        checkForLoggedInUser,
        localStorage.getItem('Name')!,
        localStorage.getItem('Email')!,
        localStorage.getItem('ImageUrl')!,
      )
     this.authService.login(newUser);

     this.router.navigate(['/home']);
    } else {
      console.log('user not detected');
    }

    //const userLoggedIn = this.authService.checkAuthentication();
    //console.log(userLoggedIn);
  }
}

@Component({
  selector: 'signin',
  template: `<google-signin></google-signin>`,
})
export class SignInComponent {
  title = 'signin page';
  constructor() {
    console.clear();
  }
}
