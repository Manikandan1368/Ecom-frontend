import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initialization();
  }

  initialization() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', [Validators.required]],
    });
  }

  register() {
    if (this.registerForm.valid) {
      const { name, email, password, phone, address } = this.registerForm.value;
      const request = { name, email, password, phone, address };

      this.authService.register(request).subscribe(
        (result) => {
          alert('User Registered Successfully');
          this.router.navigateByUrl('/login');
        },
        (error) => {
          alert('Registration Failed: ' + error.message);
        }
      );
    } else {
      alert('Please fill in all the required fields.');
    }
  }
}
