import { Component, OnInit } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { CategoryService } from '../../services/category.service';
import { Category } from '../../types/category';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, CommonModule, RouterLink, FormsModule, MatIconModule, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  categoryList : Category[]=[];
  user: any;
  isLoggedIn$: any;
  searchItem!:String;
  isAdmin: boolean = false;

  constructor(private categoryService:CategoryService, public router:Router, private authService:AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit() {
     this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects;
        if (currentUrl === '/login' || currentUrl === '/register') {
          this.authService.setLoginStatus(false);
        }
      });
    const token = localStorage.getItem('token');

    this.isLoggedIn$.subscribe((loggedIn: any) => {
  if (loggedIn) {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.isAdmin = user.isAdmin === true;
      } catch (e) {
        this.isAdmin = false;
      }
    } else {
      this.isAdmin = false;
    }

    this.loadCategories();
  } else {
    this.categoryList = [];
    this.isAdmin = false; 
  }
});

}
 loadCategories() {
    this.categoryService.getCategories().subscribe((data: any) => {
      this.categoryList = data.category;
      this.user = this.authService.userDetails;
    });
  }
searchProducts(a:any){
  this.searchItem = a.target.value.trim();
  if(this.searchItem){
    this.router.navigateByUrl("/product?search="+this.searchItem);
  }
  if(!this.searchItem){
     this.router.navigate(['/']);
  return;
  }
}

searchCategory(id:any){
  this.router.navigateByUrl("/product?categoryId="+id);
}
}
