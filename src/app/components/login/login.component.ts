import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm!:FormGroup;
  isLoggedIn: boolean = false;

  constructor(private fb:FormBuilder, private authService:AuthService, private router:Router){ }

  ngOnInit(): void {
    this.clearLocalStorage();
    this.initialization();
  }

clearLocalStorage() {
  localStorage.clear();
}


  initialization(){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]]
    })
  }

  login() {
  const {  email, password } = this.loginForm.value;
  const request = { email, password };
  this.authService.login(request).subscribe((result:any)=>{
    alert("User Login Successfully");
    localStorage.setItem ("token",result.token);
    localStorage.setItem ("user",JSON.stringify(result.user));
    setTimeout(() => {
      this.router.navigateByUrl("/");
      this.authService.setLoginStatus(true);
    }, 50);  })
  }
}
