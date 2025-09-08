import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../types/product';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { RouterLink } from '@angular/router';
import { ProductsCardComponent } from '../products-card/products-card.component';
import { AuthService } from '../../services/auth.service';
import { Category } from '../../types/category';
import { CategoryService } from '../../services/category.service';
import { WishlistService } from '../../services/wishlist.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CarouselModule, ProductsCardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
    animations: [
    trigger('autoHeight', [
      state('void', style({ height: '0px', overflow: 'hidden' })),
      state('*', style({ height: '*', overflow: 'hidden' })),
      transition('void <=> *', animate('300ms ease-in-out'))
    ])  
  ]
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  newProducts: Product[] = [];
  bannerImages: Product[]= [];
  categoryList : Category[]=[];

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    autoHeight:true,
    navText: ['', ''],
  
    nav: true
  }

  constructor(private customerService:CustomerService, private authService:AuthService, private wishlistService:WishlistService, private cartService:ShoppingCartService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
  if(token)
  {
   this.customerService.getFeaturedProducts().subscribe((data: any) => {
    this.featuredProducts = data;
    this.bannerImages = [...data];
   });
  
  this.customerService.getNewProducts().subscribe((data: any) => {
    this.newProducts = data;
    this.bannerImages = [...data];
  });

  this.wishlistService.init();
  this.cartService.init();
}
  }
  trackByFn(index: number, item: any) {
  return item._id || index;
}

}