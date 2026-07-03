import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7063/api/Auth';

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(user: any) {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  // 🔥 LOGIN SUCCESS HANDLE
  handleLoginSuccess(response: any) {
    // agar backend token de raha hai to store karo
    if (response?.token) {
      localStorage.setItem('token', response.token);
    } else {
      // temporary simple login (without JWT)
      localStorage.setItem('token', 'true');
    }

    this.isLoggedInSubject.next(true);
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }

  get isLoggedIn() {
    return this.isLoggedInSubject.value;
  }
}