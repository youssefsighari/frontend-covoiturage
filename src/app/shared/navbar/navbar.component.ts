import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  isLoggedIn = false;
  isDropdownOpen: boolean = false; // État de la liste déroulante
  profilePhotoUrl: string = 'assets/default-profile.png'; 

  constructor(private router: Router, private authService: AuthService) {}

 

  ngOnInit(): void {
    this.checkAuthenticationStatus();
    console.log('Dropdown initial state:', this.isDropdownOpen);
  
    if (this.isAuthenticated) {
      // Charger la photo de profil réelle ici (par exemple, depuis le backend)
      this.profilePhotoUrl = localStorage.getItem('profilePhoto') || this.profilePhotoUrl;
    }
    
    window.addEventListener('storage', () => {
      this.checkAuthenticationStatus();
    });

    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log('Dropdown toggled:', this.isDropdownOpen); // Vérifiez dans la console si cela s'affiche
  }
  

  logout(): void {
    this.authService.logout();
    this.isDropdownOpen = false; // Fermer le menu lors de la déconnexion
    this.router.navigate(['/login']); // Rediriger après déconnexion
  }
  

  checkAuthenticationStatus(): void {
    const token = localStorage.getItem('authToken'); 
    console.log('Token in checkAuthenticationStatus:', token); 
    this.isAuthenticated = !!token; 
    console.log('Is Authenticated:', this.isAuthenticated); 
  }
  
  
  

  login(): void {
    
    localStorage.setItem('authToken', 'dummyToken');
    this.checkAuthenticationStatus();
    this.router.navigate(['/home']);
  }

  
}
