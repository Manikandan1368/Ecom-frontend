import { Component } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { CategoryService } from '../../services/category.service';
import { Category } from '../../types/category';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  imports: [MatIconModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  
  categoryList : Category[]=[];
  mail: string = '';

  constructor(private categoryService:CategoryService, private router:Router, private snackBar: MatSnackBar){  }

  ngOnInit():void{
    this.categoryService.getCategories().subscribe((data: any) => {
      console.log('data: ', data);
      this.categoryList = data.category;
    }); 
  }

  searchCategory(id:any){
  this.router.navigateByUrl("/product?categoryId="+id);
}

showMaintenanceToast() {
  if(this.mail){
  this.snackBar.open('This feature is under maintenance.', 'Close', {
    duration: 3000,
    verticalPosition: 'top',        
    horizontalPosition: 'end',      
    panelClass: ['custom-snackbar'] 
  });
  this.mail = '';
}
}

chunkArray(arr: any[], chunkSize: number): any[][] {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}

get categoryChunks() {
  return this.chunkArray(this.categoryList, 5);
}

}   