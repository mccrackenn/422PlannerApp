import { Component, ElementRef, AfterViewInit, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user';
import { AuthService } from './services/auth.service';
declare const gapi: any;

@Component({
  selector: 'google-signin',
  // template: '<button id="googleBtn">Google Sign-In</button>',
  template: '<div id = "center"><div class="vertical-center"><button type="button" mat-raised-button id="googleBtn" color="primary">Google Sign-In</button></div></div>',
})
export class GoogleSigninComponent implements OnInit, AfterViewInit {
  private clientId =
    '652907536156-l6u4gvnflpgnvambreapqvknojiiiivg.apps.googleusercontent.com';

  constructor(
    private element: ElementRef,
    private authService: AuthService,
    private zone: NgZone,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAutheticated) {
      this.router.navigate(['/home']);
    }
  }

  private scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/admin.directory.user.readonly',
  ].join(' ');

  public auth2: any;

  
  public googleInit(): void {
    const that = this;
    gapi.load('auth2', () => {
      that.auth2 = gapi.auth2.init({
        client_id: that.clientId,
        cookiepolicy: 'single_host_origin',
        scope: that.scope,
      });
      that.attachSignin(that.element.nativeElement.firstChild);
    });
  }

  public attachSignin(element: any): void {
    const that = this;
    this.auth2.attachClickHandler(
      element,
      {},
      (googleUser: { getBasicProfile: () => any }) => {
        const profile = googleUser.getBasicProfile();

        const newUser = new User(
          '', // a blank placeholder for _id value, will filled
          profile.getId(),
          profile.getName(),
          profile.getEmail(),
          profile.getImageUrl()
        );
        // console.log(newUser);

        that.authService.login(newUser).subscribe(() => {
          that.zone.run(() => {
            that.router.navigate(['/home']);
          });
        });
      },
      (error: any) => {
        console.log('Error Logging in: ' + JSON.stringify(error, undefined, 2));
      }
    );
  }

  ngAfterViewInit(): void {
    this.googleInit();
  }
}
