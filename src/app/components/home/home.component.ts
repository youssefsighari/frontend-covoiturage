import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  username: string | null = '';

  
constructor(
  private router: Router) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    if (!this.username) {
      console.log('Username not found in localStorage');
    }

    if (localStorage.getItem('jwt')) {
      this.router.navigate(['/home']);
    }
  }

}
