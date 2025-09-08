import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../types/category';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get<Category[]>(environment.apiUrl+'/category');
  }

   getCategoryById(id: string) {
    return this.http.get<Category>(environment.apiUrl+'/category/'+id);
  }

   updateCategory(name: string, id: string,) {
    return this.http.put(environment.apiUrl+'/category/'+id, {
      name:name
    });
  }

  addCategory(name: string) {
    return this.http.post(environment.apiUrl+'/category', {
       name:name
    });
  }

   deleteCategory(id: string):Observable<{ message: string; category: any[] }> {
    return this.http.delete<{ message: string; category: any[] }>(environment.apiUrl+'/category/'+id);
  }
}
