import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Brand } from '../../../types/brand';
import { BrandService } from '../../../services/brand.service';

@Component({
  selector: 'app-brands',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent {
  displayedColumns: string[] = ['_id', 'name', 'action'];
  dataSource!: MatTableDataSource<Brand>;

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
    private brandService: BrandService,
    private cdref: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {}
  ngOnInit() {
    this.brandService.getBrands().subscribe({
      next: (data: any) => {
        this.dataSource = new MatTableDataSource(data.brands);
        this.assignPaginator();
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
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

  deleteBrand(id: string) {
    this.brandService.deleteBrand(id).subscribe({
      next: (response) => {
        alert('Brand deleted successfully');
        this.dataSource = new MatTableDataSource(response.brand);
        this.assignPaginator();
      },
      error: (err) => {
        console.error('Error deleting brand:', err);
      },
    });
  }
}
