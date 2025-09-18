import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../types/product';
import { CommonModule } from '@angular/common';
import { ProductsCardComponent } from '../products-card/products-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../types/category';
import { Brand } from '../../types/brand';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-products-list',
  imports: [
    CommonModule,
    ProductsCardComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButton,
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent implements OnInit {
  searchItem: string = '';
  categoryId: string = '';
  sortBy: string = '';
  sortOrder: number = -1;
  branchIds: string = '';
  page: number = 1;
  pageSize: number = 4;
  products: Product[] = [];
  categoryList: Category[] = [];
  brandsList: Brand[] = [];
  selectedCategoryIds: string[] = [];
  displayCategoryName: string = '';
  isNext: boolean = true;
  totalCount: number = 0;
  isLoading : boolean = true;
   
  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.customerService.getCategories().subscribe((data) => {
      this.categoryList = data;

      this.route.queryParams.subscribe((params) => {
        this.searchItem = params['search']?.trim() || '';

        const categoryParam = params['categoryId'];
        this.selectedCategoryIds = categoryParam
          ? categoryParam.split(',').filter((id: string) => id.trim() !== '')
          : [];

        this.branchIds = params['branchId'] || '';

        this.updateDisplayCategoryName();
        this.getProductList();
      });
    });

    this.customerService.getBrands().subscribe((data) => {
      this.brandsList = data;
    });
  }

  getProductList(): void {
     this.isLoading = true; 
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.searchItem || '',
        categoryId: this.selectedCategoryIds?.join(',') || '',
        branchId: this.branchIds || '',
        page: this.page,
      },
      queryParamsHandling: 'merge',
    });
    this.customerService
      .getProducts(
        this.searchItem,
        this.selectedCategoryIds,
        this.sortBy,
        this.sortOrder,
        this.branchIds,
        this.page,
        this.pageSize
      )
      .subscribe({
      next: (data) => {
        this.products = data.products;
        this.totalCount = data.totalCount;

        const totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.isNext = this.page < totalPages;
        this.isLoading = false; 
        this.searchItem = '';
        this.customerService.updateSearchValue(this.searchItem);

      },
      error: (err) => {
        console.error('Error loading products', err);
        this.isLoading = false; 
        this.searchItem = '';
        this.customerService.updateSearchValue(this.searchItem);
      }
    });
  }
  onCategoryChange() {
    this.updateDisplayCategoryName();
    this.getProductList();
  }

  getCategoryNameById(id: string | undefined): string {
    return this.categoryList.find((c) => c._id === id)?.name || '';
  }

  trackByCategoryId(index: number, category: any): string {
    return category._id;
  }

  updateDisplayCategoryName() {
    // this.searchItem = '';  
    this.customerService.updateSearchValue(this.searchItem);
    const firstCategoryId = this.selectedCategoryIds?.[0];
    const name =
      this.categoryList.find((c) => c._id === firstCategoryId)?.name || '';
    const additionalCount = (this.selectedCategoryIds?.length || 0) - 1;

    this.displayCategoryName = name;

    if (additionalCount > 0) {
      this.displayCategoryName += ` (+${additionalCount} ${
        additionalCount === 1 ? 'other' : 'others'
      })`;
    }
  }

  orderChange(a: any) {
    this.sortBy = 'price';
    this.sortOrder = a.value;
    this.getProductList();
  }

  pageChange(a: any) {
    this.page = a;
    this.getProductList();
  }

  trackByFn(index: number, item: Product) {
    return item._id;
  }
}
