import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';  
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-profile',
  imports: [CommonModule],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.scss'
})
export class CustomerProfileComponent implements OnInit {

  userDetails: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userDetails = this.authService.userDetails;  
  }

  logout(): void {
    this.authService.logout();  
  }
}

