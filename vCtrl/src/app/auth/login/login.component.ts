import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/core/Services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private snackBar: MatSnackBar, public auth: AngularFireAuth, private loadingService: LoadingService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('admin@vctrl.in', [Validators.required, Validators.email]),
      password: new FormControl('123456', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]),
    });
  }

  login() {
    if (!this.loginForm.valid) {
      this.snackBar.open("Please enter valid login data!", "OK", { duration: 3000 });
      return;
    }

    this.loadingService.presentLoading("Logging in...");

    this.auth.signInWithEmailAndPassword(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value).then(response => {
      this.loadingService.dismissLoading();
      if(response.user){
        this.snackBar.open("Login successsful!", "OK", {duration: 3000});
        this.router.navigateByUrl("/");
      }
    }).catch(error => {
      console.log(error);
      if (error.code == "auth/user-not-found") {
        this.snackBar.open("Login failed. User not found or invalid credentials provided!", "OK", { duration: 3000 });
        this.loadingService.dismissLoading();
      }
    });
  }

}
