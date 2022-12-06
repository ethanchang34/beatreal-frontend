import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

function makeid(length: number) {
  let result = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  phone_regex = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
  registerForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    username: new FormControl(null, [Validators.required]),
    firstname: new FormControl(null, [Validators.required, Validators.min(2)]),
    lastname: new FormControl(null, [Validators.required]),
    phoneNumber: new FormControl(null, [
      Validators.required,
      Validators.pattern(this.phone_regex),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$'),
    ]),
  });

  constructor(private router: Router, private http: HttpClient) {}

  url = 'http://localhost:3000/security/register';
  id = '';
  errorMessage = '';

  register() {
    if (!this.registerForm.valid) {
      return;
    } else {
      this.http
        .post(this.url, {
          email: this.registerForm.value.email,
          username: this.registerForm.value.username,
          password: this.registerForm.value.password,
          firstName: this.registerForm.value.firstname,
          lastName: this.registerForm.value.lastname,
          phoneNumber: this.registerForm.value.phoneNumber,
        })
        .subscribe((res: any) => {
          if (res['status'] == 'ok') {
            console.log(res);
            this.router.navigateByUrl(
              `/profile/${this.registerForm.value.username}`
            );
          }
          if (res['status'] == 'error') {
            console.log(res);
            alert(res['data']);
          }
        });
    }
    return;
  }

  spotifyRedirect() {
    //    let state = makeid(16);
    //  let scope = `streaming user-read-email user-read-private user-library-read user-library-modify
    //   user-read-playback-state user-modify-playback-state`;

    // res.send({ status: "ok", result: authorize_url })

    window.location.href =
      'https://accounts.spotify.com/authorize?client_id=3ecc3a4b5b974d02a9b9e12b7f2ace9b&response_type=code&redirect_uri=http://localhost:4200/profile&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state';

    //TODO: .env to hide spotify stuff, get the spotify ID, add it to the user's profile
    //need to figure out how to get the GUID of the user we just created, where to do this call to post the spotifyID

    /*
         let idEndpoint = 'https://api.spotify.com/v1/me/id';
        let getResponse = fetch( idEndpoint, {
          method: 'GET',
          headers: {
            'Authorization':' ',
            'Content-Type':'application/json'
          }
        });

        let postEndpoint = 'http://localhost:3000/spotify/link//getResponse';
        let postResponse = fetch( postEndpoint, {
          method: 'post',
          headers: {
            'Authorization':' ',
            'Content-Type':'application/json'
          }
        });
        */
  }
}
