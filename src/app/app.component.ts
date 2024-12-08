import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CarGo_angular';
  constructor(private router: Router) {}

  // Liste des routes où la navbar ne doit pas apparaître
  shouldShowNavbar(): boolean {
    const excludedRoutes = ['/login', '/register'];
    return !excludedRoutes.includes(this.router.url);
  }
}
