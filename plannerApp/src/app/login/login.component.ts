import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  template: `
    <div id = "center">  <div class="vertical-center"> <signin mat-button></signin></div></div>
    `
})
export class LoginComponent {
  constructor() { console.clear(); }
}


@Component({
  selector: 'signin',
  template: `<google-signin mat-button></google-signin>`
})
export class SignInComponent {
  title     = "signin page";
  constructor() { console.clear(); }
}
