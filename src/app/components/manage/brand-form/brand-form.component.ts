import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrandService } from '../../../services/brand.service';

@Component({
  selector: 'app-brand-form',
  imports: [FormsModule, MatInputModule, MatButtonModule, CommonModule],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss'
})
export class BrandFormComponent {
 name!: string;
  id!: string;
  isEditMode: boolean = false;
  buttonName='Save';
  constructor(private brandService:BrandService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'] || '';
    console.log('this.id: ', this.id);
    if(this.id){
      this.isEditMode = true;
      this.buttonName = 'Update';
      this.brandService.getBrandById(this.id).subscribe((data: any) => {
        console.log('data: ', data);
          this.name = data.brand.name;
      });
    }
    else {
      this.isEditMode = false;
      this.buttonName = 'Save';
    }
  }

  save(){
    if (this.name && !this.id) {
    this.brandService.addBrand(this.name).subscribe({
      next: () => {
        alert('Brand added successfully');
        this.name = '';
        this.router.navigateByUrl('/admin/brands');
      },
      error: (err: any) => {
        console.error('Error adding brand:', err);
      }
    });
  }
    else if (this.id) {
    this.brandService.updateBrand(this.name,this.id).subscribe({
      next: () => {
        alert('Brand updated successfully');
        this.name = '';
        this.isEditMode = false;
        this.router.navigateByUrl('/admin/brands');
      },
      error: (err: any) => {
        console.error('Error adding Brand:', err);
      }
    });
  } else {
    console.error('Brand name is required');
  }
  }
}
