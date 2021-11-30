import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor() { }
  userName = sessionStorage.getItem('Name');
  userEmail = sessionStorage.getItem('Email:');
  userImage = sessionStorage.getItem('ImageURL:')
  
  ngOnInit(): void {
    if (sessionStorage.getItem('ID:') != null){
      this.userEmail = sessionStorage.getItem('Email:');
      this.userName = sessionStorage.getItem('Name:');
      this.userImage = sessionStorage.getItem('Image URL:');
    }
  }


}