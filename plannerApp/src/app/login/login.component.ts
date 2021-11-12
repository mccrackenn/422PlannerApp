import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  template: `
    <signin></signin>
    `
})
export class LoginComponent {
  constructor() { console.clear(); }
}

@Component({
  selector: 'signin',
  template: `<google-signin></google-signin>`
})
export class SignInComponent {
  title     = "signin page";
  constructor() { console.clear(); }
}
