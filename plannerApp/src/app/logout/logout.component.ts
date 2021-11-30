import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor() { }

  clearLoginData(): void {
    console.log("Logout Happened");
    sessionStorage.setItem('ID:', "" );
    sessionStorage.setItem('Name:', "" );
    window.location.href = '/';
  }

  ngOnInit(): void {
  }

}
