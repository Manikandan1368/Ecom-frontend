import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ProductsCardComponent } from '../products-card/products-card.component';
import { Product } from '../../types/product';
import { WishlistService } from '../../services/wishlist.service';
import { MatButtonModule } from '@angular/material/button';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-products-detail',
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ProductsCardComponent,
    RouterLink,
    MatButtonModule,
  ],
  templateUrl: './products-detail.component.html',
  styleUrl: './products-detail.component.scss',
})
export class ProductsDetailComponent implements OnInit {
  totalCount: any;
  pageSize: any;

  buyNow(arg0: any) {
    throw new Error('Method not implemented.');
  }
  product: any;
  selectedImage: string = '';
  selectedTab: string = 'specs';
  newReview = { user: '', comment: '' };
  similarProducts: Product[] = [];

  constructor(
    private customerService: CustomerService,
    private activeRoute: ActivatedRoute,
    private wishlistService: WishlistService,
    private shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    const id = this.activeRoute.snapshot.paramMap.get('id');
    this.activeRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string): void {
    this.customerService.getProductById(id).subscribe((data) => {
      this.product = data;
      this.selectedImage = this.product.images?.[0]?.image || '';

      this.product.specifications = [
        { label: 'Price', value: '₹' + this.product.price },
        { label: 'Discount', value: this.product.discount + '%' },
        { label: 'Is New', value: this.product.isNew ? 'Yes' : 'No' },
        { label: 'Is Featured', value: this.product.isFeatured ? 'Yes' : 'No' },
      ];

      this.product.reviews = this.product.reviews || [
        { user: 'Alex', comment: 'Loved the quality!' },
        { user: 'Sara', comment: 'Color is great, worth the price.' },
      ];

      // Fetch similar products
      this.customerService
        .getProducts('', this.product.categoryId, '', -1, '', 1, 10)
        .subscribe((result) => {
          this.similarProducts = result.products
            .filter((p: any) => p._id !== this.product._id)
            .slice(0, 4);
        });
    });
  }

  changeImage(imgUrl: string): void {
    this.selectedImage = imgUrl;
  }

  setTab(tab: string): void {
    this.selectedTab = tab;
  }

  submitReview() {
    if (!this.newReview.user || !this.newReview.comment) return;

    // Call the backend API to save the review
    this.customerService.addReview(this.product._id, this.newReview).subscribe({
      next: (savedReview: any) => {
        this.product.reviews.push(savedReview);
        this.newReview = { user: '', comment: '' };
      },
      error: (err: any) => {
        console.error('Failed to submit review', err);
      },
    });
  }

  trackByFn(index: number, item: any) {
    return item._id || index;
  }

  addToWishlist(product: Product) {
    if (this.isInWishlist(product)) {
      this.wishlistService.removeFromWishlist(product._id!).subscribe(() => {
        this.wishlistService.init();
      });
    } else {
      this.wishlistService.addToWishlist(product._id!).subscribe(() => {
        this.wishlistService.init();
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
      });
    } else {
      this.shoppingCartService.removeFromCart(productId).subscribe(() => {
        this.shoppingCartService.init();
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
