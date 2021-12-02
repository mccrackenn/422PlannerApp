import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private userSub!: Subscription; //get updates from the AuthService about a logged in User
  isAuthenticated= false; //Bool to track whether a user is logged in/authenticated
  user!:User;

  constructor(private authService:AuthService, private router:Router) { }

  ngOnInit(): void {
    this.userSub=this.authService.user$.subscribe(user => {

        this.isAuthenticated =!!user; //short-hand to check if user logged in, could be a terinary statement also
        this.user=user
        console.log(this.isAuthenticated)
        console.log(user)
      }
    )
  }

}
