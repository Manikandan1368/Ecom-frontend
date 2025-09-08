import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoryService } from '../../../services/category.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Category } from '../../../types/category';

export interface UserData {
  id: string;
  name: string;
}

@Component({
  selector: 'app-categories',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, RouterModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

  displayedColumns: string[] = ['_id', 'name', 'action'];
  dataSource!: MatTableDataSource<Category>;
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
  constructor(private categoryService: CategoryService, private cdref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (data: any) => {
        this.dataSource = new MatTableDataSource(data.category);
        this.assignPaginator();
      },
      error: (err) => {
        console.error("Error fetching categories:", err);
      }
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

  deleteCategory(id: string) {
    this.categoryService.deleteCategory(id).subscribe({
      next: (response) => {
        alert('Category deleted successfully');
        this.dataSource = new MatTableDataSource(response.category);
        this.assignPaginator();
      },
      error: (err) => {
        console.error('Error deleting category:', err);
      }
    });
  }

}
