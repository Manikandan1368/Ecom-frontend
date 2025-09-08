import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../types/brand';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient) { }

  getBrands() {
    return this.http.get<Brand[]>(environment.apiUrl+'/brand');
  }

   getBrandById(id: string) {
    return this.http.get<Brand>(environment.apiUrl+'/brand/'+id);
  }

   updateBrand(name: string, id: string,) {
    return this.http.put(environment.apiUrl+'/brand/'+id, {
      name:name
    });
  }

  addBrand(name: string) {
    return this.http.post(environment.apiUrl+'/brand', {
       name:name
    });
  }

   deleteBrand(id: string):Observable<{ message: string; brand: any[] }> {
    return this.http.delete<{ message: string; brand: any[] }>(environment.apiUrl+'/brand/'+id);
  }
}

