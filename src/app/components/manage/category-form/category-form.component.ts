import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-form',
  imports: [FormsModule, MatInputModule, MatButtonModule, CommonModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit{
  name!: string;
  id!: string;
  isEditMode: boolean = false;
  buttonName='Save';
  constructor(private categoryServies:CategoryService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'] || '';
    console.log('this.id: ', this.id);
    if(this.id){
      this.isEditMode = true;
      this.buttonName = 'Update';
      this.categoryServies.getCategoryById(this.id).subscribe((data: any) => {
        console.log('data: ', data);
          this.name = data.category.name;
      });
    }
    else {
      this.isEditMode = false;
      this.buttonName = 'Save';
    }
  }

  save(){
    if (this.name && !this.id) {
    this.categoryServies.addCategory(this.name).subscribe({
      next: () => {
        alert('Category added successfully');
        this.name = '';
        this.router.navigateByUrl('/admin/categories');
      },
      error: (err: any) => {
        console.error('Error adding category:', err);
      }
    });
  }
    else if (this.id) {
    this.categoryServies.updateCategory(this.name,this.id).subscribe({
      next: () => {
        alert('Category updated successfully');
        this.name = '';
        this.isEditMode = false;
        this.router.navigateByUrl('/admin/categories');
      },
      error: (err: any) => {
        console.error('Error adding category:', err);
      }
    });
  } else {
    console.error('Category name is required');
  }
  }
}
