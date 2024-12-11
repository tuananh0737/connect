import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  userRole: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.isLoggedIn = true;
      this.fetchUserRole(token);
    } else {
      this.userRole = 'ROLE_USER'; 
    }
  }

  fetchUserRole(token: string): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post('/api/userlogged', {}, { headers }).subscribe({
      next: (response: any) => {
        this.userRole = response?.role || '';
      },
      error: (error) => {
        console.error('Failed to fetch user role:', error);
        this.userRole = 'ROLE_USER'; 
      }
    });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isLoggedIn = false;
    this.userRole = 'ROLE_USER';
    this.router.navigate(['/home']);
  }
}
