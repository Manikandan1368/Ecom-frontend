import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Product } from '../../types/product';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WishlistService } from '../../services/wishlist.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-products-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './products-card.component.html',
  styleUrl: './products-card.component.scss',
})
export class ProductsCardComponent implements OnInit {
  @Input() product!: Product;
  @Input() searchItem!: string;
  @Output() wishlistChanged = new EventEmitter<string>();
  isWishlisted = false;

  constructor(
    private wishlistService: WishlistService,
    private shoppingCartService: ShoppingCartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  checkWishlist() {
    this.isWishlisted = this.wishlistService.wishlists.some(
      (item) => item._id === this.product._id
    );
  }

  addToWishlist(product: Product) {
    if (this.isInWishlist(product)) {
      this.wishlistService.removeFromWishlist(product._id!).subscribe(() => {
        this.wishlistService.init();
        this.wishlistChanged.emit(this.product._id);
      });
    } else {
      this.wishlistService.addToWishlist(product._id!).subscribe(() => {
        this.wishlistService.init();
        this.wishlistChanged.emit(this.product._id);
      });
    }
  }

  isInWishlist(product: Product) {
    let isExist = this.wishlistService.wishlists.find(
      (item) => item._id == product._id
    );
    if (isExist) return true;
    else return false;
  }

  addToCart(product: Product) {
    const productId = product._id!;
    if (!this.isInShoppingCart(productId)) {
      this.shoppingCartService.addToCart(productId, 1).subscribe(() => {
        this.shoppingCartService.init();
        this.cdr.detectChanges();
      });
    } else {
      this.shoppingCartService.removeFromCart(productId).subscribe(() => {
        this.shoppingCartService.init();
        this.cdr.detectChanges();
      });
    }
  }

  isInShoppingCart(productId: string): boolean {
    const exists = this.shoppingCartService.cartList.some(
      (item) => item.productId && item.productId._id === productId
    );
    return exists;
  }
}
