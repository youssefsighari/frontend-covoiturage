import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoggedIn());

  constructor() {}

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  login(): void {
    this.isLoggedInSubject.next(true);
  }

  logout(): void {
    localStorage.clear(); // Supprime les données de connexion
    this.isLoggedInSubject.next(false);
  }

  private checkLoggedIn(): boolean {
    return !!localStorage.getItem('jwt');
  }
}