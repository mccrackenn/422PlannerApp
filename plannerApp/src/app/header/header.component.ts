import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  currentUser: User | null | undefined;

  constructor(public authService: AuthService, private router: Router) {
    this.authService.userObj.subscribe(user => {
      this.currentUser = user;
    });
  }

  logoutClicked(): void {
    this.authService.logout();
  }

}
