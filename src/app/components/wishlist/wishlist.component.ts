import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { ProductsCardComponent } from '../products-card/products-card.component';
import { CommonModule } from '@angular/common';
import { Product } from '../../types/product';

@Component({
  selector: 'app-wishlist',
  imports: [ProductsCardComponent, CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit{

  searchItem:string='';
  products: Product[]=[];
  
  constructor(private wishlistService:WishlistService){
  }

  ngOnInit(): void {
    this.wishlistService.init();
    this.products = this.wishlistService.wishlists;
  }

  trackByFn(index: number, item: Product) {
  return item._id;
  }

 onWishlistChanged(removedProductId: string) {
  this.products = this.products.filter(p => p._id !== removedProductId);
}

}
