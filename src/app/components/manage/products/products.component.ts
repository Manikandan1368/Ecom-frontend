import {
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { ProductService } from '../../../services/product.service';
import { Product } from '../../../types/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    RouterModule,
    CommonModule
  ],
   templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  displayedColumns: string[] = ['_id', 'name', 'shortDescription', 'price', 'discount', 'action'];
  dataSource!: MatTableDataSource<Product>;

  paginator!: MatPaginator;
  sort!: MatSort;

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
    this.assignPaginator();
  }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.sort = sort;
    this.assignPaginator();
  }
  constructor(
    private productService: ProductService,
    private cdref: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {}
  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        console.log('data: ', data);
        this.dataSource = new MatTableDataSource(data.products);
        this.assignPaginator();
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }

  assignPaginator() {
    if (this.dataSource && this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteProduct(id: string) {
    console.log('Delete products with ID:', id);
    this.productService.deleteProduct(id).subscribe({
      next: (response) => {
        alert('Product deleted successfully');
        this.dataSource = new MatTableDataSource(response.product);
        this.assignPaginator();
      },
      error: (err) => {
        console.error('Error deleting products:', err);
      },
    });
  }
}

