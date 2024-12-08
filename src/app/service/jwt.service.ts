import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

const BASE_URL = "http://localhost:8080/"; 

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(private http: HttpClient) { }

  register(signRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'signup', signRequest);
  }
  login(loginRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'Login', loginRequest).pipe(
      tap((response: any) => {
        if (response && response.jwt) {
          localStorage.setItem('jwt', response.jwt);
          localStorage.setItem('customerId', response.customerId);
          localStorage.setItem('username', response.firstName); 

        }
      })
    );
  }
  
  
  
}
