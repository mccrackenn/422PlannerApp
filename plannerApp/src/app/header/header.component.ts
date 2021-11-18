import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  sessionID = '';
  haveSessionID = false;

  constructor() { }

  ngOnInit(): void {
    const id = sessionStorage.getItem('ID:');
    if (id) {
      this.sessionID = id;
      this.haveSessionID = true;
    }
  }
}
