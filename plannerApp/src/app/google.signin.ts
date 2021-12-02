// this login scheme was dervied from this article
//  https://stackoverflow.com/questions/42279585/how-to-use-google-api-from-different-components-of-angular

import { Component, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from './models/user';
import { AuthService } from './services/auth.service';
declare const gapi: any;

@Component({
  selector: 'google-signin',
  template: '<button id="googleBtn">Google Sign-In</button>',
})
export class GoogleSigninComponent implements AfterViewInit {
  private clientId: string =
    '652907536156-l6u4gvnflpgnvambreapqvknojiiiivg.apps.googleusercontent.com';

  constructor(
    private element: ElementRef,
    private authService: AuthService,
    private zone: NgZone,
    private router: Router
  ) {
    console.log('ElementRef: ', this.element);
  }

  private scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/admin.directory.user.readonly',
  ].join(' ');

  public auth2: any;
  public googleInit() {
    let that = this;
    gapi.load('auth2', function () {
      that.auth2 = gapi.auth2.init({
        client_id: that.clientId,
        cookiepolicy: 'single_host_origin',
        scope: that.scope,
      });
      that.attachSignin(that.element.nativeElement.firstChild);
    });
  }
  public attachSignin(element: any) {
    let that = this;
    this.auth2.attachClickHandler(
      element,
      {},
      function (googleUser: { getBasicProfile: () => any }) {
        let profile = googleUser.getBasicProfile();
        // console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        // YOUR CODE HERE

        // save 2 to this session's strorage
        sessionStorage.setItem('ID:', profile.getId());
        sessionStorage.setItem('Name:', profile.getName());
        const newUser = new User(profile.getId(), profile.getName(),
          profile.getEmail(), profile.getImageUrl());
        console.log(newUser);
        // A user is logged in, now the rest of the app can react accordingly
        that.authService.login(newUser);
        // Had to use NgZone and wrap this call, kept getting an error related to trying to run
        // Angular calls inside non-Angular JS callbacks.
        that.zone.run(() => {
          that.router.navigate(['/home']);
        });
      },
      function (error: any) {
        console.log(JSON.stringify(error, undefined, 2));
      }
    );
  }

  ngAfterViewInit() {
    this.googleInit();
  }
}
