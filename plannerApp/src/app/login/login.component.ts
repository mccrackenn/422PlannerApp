import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <signin></signin>
    `
})
export class LoginComponent {
  constructor(private authService: AuthService) {
    const userLoggedIn = authService.checkAuthentication();
    console.clear();
    console.log(userLoggedIn);
  }
}

@Component({
  selector: 'signin',
  template: `<google-signin></google-signin>`
})
export class SignInComponent {
  title     = "signin page";
  constructor() { console.clear(); }
}
