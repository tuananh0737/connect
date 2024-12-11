import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-borrow-book',
  templateUrl: './borrow-book.component.html',
  styleUrls: ['./borrow-book.component.css']
})
export class BorrowBookComponent implements OnInit {
  borrowBooks: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient ) {}

  ngOnInit(): void{
    const token = localStorage.getItem('authToken');
    if (token) {
      this.fetchBorrowBooks(token);
    } else {
      this.errorMessage = 'Đăng nhập để tiếp tục.';
    }
  }

  fetchBorrowBooks(token: string): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get('/api/user/find-borrowBook-by-user', { headers}).subscribe({
      next: (Response: any) => {
        this.borrowBooks = Response;
      },
      error: (error) => {
        this.errorMessage = error.error?.errorMessage || 'Lỗi khi tải danh sách';
        console.error('Error: ', error);
      },
    })
  }

}
