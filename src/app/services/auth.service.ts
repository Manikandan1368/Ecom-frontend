import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  
  constructor(private http:HttpClient) {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
     this.isLoggedInSubject.next(true);
  }
}

  register(req:any){
    return this.http.post(environment.apiUrl+"/auth/register", req);
  }

  login(req:any):Observable<any>{
    return this.http.post(environment.apiUrl+"/auth/login", req);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  get isLoggedIn(){
    let token = localStorage.getItem('token');
    if(token){
      return true;
    }
    return false;
  }

  get isAdmin(){
    let userData = localStorage.getItem('user');
    if(userData){
     let user = JSON.parse(userData);
       return user.isAdmin;
    }
    return false;
  }

  get userDetails(){
    let userData = localStorage.getItem('user');
    if(userData){
      return JSON.parse(userData);
    }
    return null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setLoginStatus(false);
  }

    setLoginStatus(status: boolean) {
    this.isLoggedInSubject.next(status);
  }
}
