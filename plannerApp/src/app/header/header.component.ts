import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  sessionID ='';
  constructor(){}
   ngOnInit():void{
    const id = sessionStorage.getItem('ID:');
    if(id){
      this.sessionID = id;
    }
    console.log(this.sessionID);
    if(sessionStorage.getItem('ID:') == null){
      
    }
  }
  
  
  clearLoginData(): void {
    console.log("Logout Happened");
    sessionStorage.setItem('ID:', "" );
    sessionStorage.setItem('Name:', "" );
    sessionStorage.setItem('Email:', "" );
    window.location.href = '/';
  }
  
}
@Component({
  selector: 'ng-if-simple',
  template: `
    <div (click)="show = !show">{{show ? 'hide' : 'show'}}</div>
    show = {{show}}
`
})
export class NgIfElse {
  public show:boolean = false;
  public headerList:any = 'Show';

  toggle() {
    this.show = !this.show;

    if (sessionStorage.getItem('ID:') == null){ 
      this.headerList = "Hide";
    }
    else
      this.headerList = "Show";
  }
}
