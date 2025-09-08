import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

// Angular Material modules
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// Services & Types
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { Category } from '../../../types/category';
import { Brand } from '../../../types/brand';
import { map, Observable, startWith } from 'rxjs';

interface ItemList {
  id: string;
  item: string;
  code?: string;
  selected: boolean;
}

@Component({
  // standalone: true,
  selector: 'app-product-form',
  imports: [
    CommonModule,
    MatChipsModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatAutocompleteModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  @ViewChild('chipList') chipList: any;
  name!: string;
  id!: string;
  isEditMode: boolean = false;
  buttonName = 'Save';
  productForm!: FormGroup;
  i!: number;
  categoryList: Category[] = [];
  brandList: Brand[] = [];
  filteredOptions!: Observable<Category[]>;
  isMultiSelect: boolean = true;
  selectedCategories: Category[] = []; // Categories selected (chips)

  categoryCtrl = new FormControl();
  filteredItems: ItemList[] = [];
  selectedItems: ItemList[] = [];
  // categoryList: Category[] = [];
  // isAllSelected: boolean = false;
  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private categoriesService: CategoryService,
    private brandsService: BrandService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'] || '';
    // console.log('this.id: ', this.id);
    this.initializationForm();
    this.categoriesService.getCategories().subscribe((data: any) => {
      console.log('data: ', data);
      this.categoryList = data.category;
      this.filteredOptions = this.categoryCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value.toLowerCase() : '')),
        map((name) => (name ? this._filter(name) : this.categoryList.slice()))
      );
    });
    this.brandsService.getBrands().subscribe((data: any) => {
      console.log('data: ', data);
      this.brandList = data.brands;
      console.log('this.brandList: ', this.brandList);
    });
    if (this.id) {
      this.isEditMode = true;
      this.buttonName = 'Update';
      //     this.productService.getProductById(this.id).subscribe((data: any) => {
      //       // console.log('data: ', data);
      //         this.productForm.patchValue(data.product);
      //         console.log('this.productForm: ', this.productForm);
      //         // console.log('Form Status:', this.productForm.status);
      //         const imagesArray = this.productForm.get('images') as FormArray;
      // imagesArray.clear(); // Clear existing controls

      // data.product.images.forEach((img: any) => {
      //   imagesArray.push(this.fb.group({
      //     image: [img.image]
      //   }));
      // });

      //     });
      this.productService.getProductById(this.id).subscribe((data: any) => {
        console.log('data: ', data);
        setTimeout(() => {
          this.productForm.patchValue(data.product);

          const imagesArray = this.productForm.get('images') as FormArray;
          imagesArray.clear();

          data.product.images.forEach((img: any) => {
            imagesArray.push(
              this.fb.group({
                image: [img.image],
              })
            );
          });
          this.selectedCategories = this.categoryList.filter((cat) =>
            data.product.categoryId.includes(cat._id)
          );
        });
      });
    } else {
      this.isEditMode = false;
      this.buttonName = 'Save';
    }
  }

  isSelected(option: Category): boolean {
    return this.selectedCategories.some((sel) => sel._id === option._id);
  }

  // When user selects a category from autocomplete options
  // optionSelected(event: any) {
  //   const category: Category = event.option.value;
  //   if (!this.selectedCategories.find(c => c._id === category._id)) {
  //     this.selectedCategories.push(category);
  //     this.updateCategoryIds();
  //   }
  //   this.categoryCtrl.setValue('');
  // }

  // Optional: add category by typing and pressing enter (chipInputTokenEnd)
  addCategoryFromInput(event: any) {
    const input = event.input;
    const value = event.value.trim();

    if (value) {
      // Add only if it exists in categoryList and not already selected
      const existing = this.categoryList.find(
        (cat) => cat.name.toLowerCase() === value.toLowerCase()
      );
      if (
        existing &&
        !this.selectedCategories.some((c) => c._id === existing._id)
      ) {
        this.selectedCategories.push(existing);
        this.updateCategoryIds();
      }
    }

    if (input) {
      input.value = '';
    }
    this.categoryCtrl.setValue('');
  }

  initializationForm() {
    this.productForm = this.fb.group({
      _id: [null],
      name: [null, [Validators.required, Validators.minLength(5)]],
      shortDescription: [null, [Validators.required, Validators.minLength(10)]],
      description: [null, [Validators.required, Validators.minLength(20)]],
      price: [null, [Validators.required]],
      discount: [],
      images: this.fb.array([]),
      categoryId: [[], Validators.required],
      brandId: [[], Validators.required],
      isFeatured: [false],
      isNewProduct: [false],
    });
  }

  addImage() {
    this.images().push(
      this.fb.group({
        image: [null],
      })
    );
    this.cdr.detectChanges();
  }

  removeImage() {
    this.images().removeAt(this.images().controls.length - 1);
    this.cdr.detectChanges();
  }

  print() {
    Object.keys(this.productForm.controls).forEach((controlName) => {
      const control = this.productForm.get(controlName);
      if (control && control.invalid) {
        console.warn(`❌ Invalid Control: '${controlName}'`, control.errors);
      } else {
        console.log(`✅ Valid Control: '${controlName}'`);
      }
    });
  }

  ngAfterViewInit() {}


  images() {
    return this.productForm.get('images') as FormArray;
  }

  save() {
      if (this.productForm.valid) {
      if (!this.id) {

        this.productService.addProduct(this.productForm.value).subscribe({
          next: () => {
            alert('Product added successfully');
            this.router.navigateByUrl('/admin/products');
            this.productForm.reset();
          },
          error: (err: any) => {
            console.error('Error adding product:', err);
          },
        });
      } else {
        this.productService
          .updateProduct(this.id, this.productForm.value)
          .subscribe(
            (response: any) => {
              alert('Product updated successfully');
              this.productForm.reset();
              this.isEditMode = false;
              this.productForm.patchValue(response.product);
              const imagesArray = this.productForm.get('images') as FormArray;
              imagesArray.clear();

              response.product.images.forEach((img: any) => {
                imagesArray.push(
                  this.fb.group({
                    image: [img.image],
                  })
                );
              });
            },
            (err: any) => {
              console.error('Error updating product:', err);
            }
          );
      }
    } else {
      console.error('Product form is invalid');
    }
  }

  private _filter(value: string): Category[] {
    const filterValue = value.toLowerCase();
    return this.categoryList.filter(
      (cat) =>
        cat.name.toLowerCase().includes(filterValue) &&
        !this.selectedCategories.some((s) => s._id === cat._id)
    );
  }

  displayCategoryName(category: Category): string {
    return category ? category.name : '';
  }

  isAllSelected(filtered: Category[]): boolean {
    return (
      filtered.length > 0 &&
      filtered.every((cat) =>
        this.selectedCategories.some((sel) => sel._id === cat._id)
      )
    );
  }

  toggleSelectAll(filtered: Category[]): void {
    if (this.isAllSelected(filtered)) {
      // Remove all filtered from selected
      this.selectedCategories = this.selectedCategories.filter(
        (sel) => !filtered.some((f) => f._id === sel._id)
      );
    } else {
      // Add all filtered to selected
      filtered.forEach((cat) => {
        if (!this.selectedCategories.some((sel) => sel._id === cat._id)) {
          this.selectedCategories.push(cat);
        }
      });
    }
    this.updateCategoryIds();
  }

  // Toggle single category selection (called when checkbox clicked)
  toggleSelection(category: Category): void {
    const idx = this.selectedCategories.findIndex(
      (sel) => sel._id === category._id
    );
    if (idx >= 0) {
      this.selectedCategories.splice(idx, 1);
    } else {
      this.selectedCategories.push(category);
    }
    this.updateCategoryIds();
  }

  // Remove chip
  removeCategory(category: Category): void {
    const idx = this.selectedCategories.findIndex(
      (sel) => sel._id === category._id
    );
    if (idx >= 0) {
      this.selectedCategories.splice(idx, 1);
      this.updateCategoryIds();
    }
  }

  // Sync selected categories' IDs to form control
  updateCategoryIds(): void {
    const ids = this.selectedCategories.map((c) => c._id);
    this.productForm.controls['categoryId'].setValue(ids);
    this.productForm.controls['categoryId'].markAsDirty();
  }
}
