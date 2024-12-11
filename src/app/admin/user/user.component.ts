import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import * as e from 'cors';
import { take } from 'rxjs';

interface User {
  id: number;
  username: string;
  fullname: string;
  actived: boolean;
  borrowBook: string;
  pageInYear:number;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = [];

  constructor(private http: HttpClient) {}


  ngOnInit(): void {
  const token = localStorage.getItem('authToken');

  const headers = { Authorization: `Bearer ${token}`};
  const url = '/api/admin/getUserByRole?role=ROLE_USER';
    this.http.get<User[]>(url, {headers}).subscribe({
      next: (data) => {
        this.users = data;
      },
      error:(err) => {
        console.error('Lỗi khi gọi API:', err);        
      },
    })
  }

  showBorrowBook(): void {
    
  }

}
