import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-borrow-book',
  templateUrl: './borrow-book.component.html',
  styleUrls: ['./borrow-book.component.css']
})
export class BorrowBookComponent implements OnInit {
  borrowBooks: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.fetchBorrowBooks(token);
  
      this.route.queryParams.subscribe(params => {
        const bookId = params['bookId'];
        if (bookId) {
          this.scrollToBook(bookId);
        }
      });
    } else {
      this.errorMessage = 'Đăng nhập để tiếp tục.';
    }
  }
  
  scrollToBook(bookId: number): void {
    setTimeout(() => {
      const bookElement = document.getElementById(`book-${bookId}`);
      if (bookElement) {
        bookElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        bookElement.classList.add('highlight'); 
      }
    }, 500); 
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
