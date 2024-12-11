import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  userInfo: any = null;
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.fetchUserInfo(token);      
    } else {
      this.errorMessage = 'No token found. Please login first.';
    }
  }

  

  fetchUserInfo(token: string): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post('/api/userlogged', { headers }).subscribe({
      next: (response) => {
        this.userInfo = response;
      },
      error: (error) => {
        this.errorMessage = error.error?.errorMessage || 'Failed to fetch user information';
        console.error('Error:', error);
      }
    });
  }
}
