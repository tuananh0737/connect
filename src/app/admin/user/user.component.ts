import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';


interface User {
  id: number;
  username: string;
  fullname: string;
  actived: boolean;
  phone: string;
  borrowBook: string;
  pageInYear:number;
}

interface BorrowedBook {
  bookName: string;
  authorName: string;
  genre: string;
  publishYear: number;
  borrowedDate: string;
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

  borrowedBooks: BorrowedBook[] = []; 
  showModal: boolean = false;

  showBorrowBook(userId: number): void {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    const url = `/api/admin/find-borrowBook?userId=${userId}`;

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        this.borrowedBooks = data.map(item => ({
          bookName: item.book.name,
          authorName: item.book.author.fullname,
          borrowedDate: item.createdDate,
          genre: item.book.genres.name,       
          publishYear: item.book.publishYear 
        }));
        this.showModal = true; 
      },
      error: (err) => {
        console.error('Lỗi khi lấy sách đã mượn:', err);
        alert('Không thể lấy danh sách sách đã mượn.');
      }
    });
  }
  closeModal(): void {
    this.showModal = false; 
  }

  showDeleteConfirm: boolean = false;
  userToDeleteId: number | null = null;

  deleteUser(userId: number): void {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.userToDeleteId = userId;
      this.showDeleteConfirm = true;
    }
  }

  confirmDelete(): void {
    if (!this.userToDeleteId) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Bạn chưa đăng nhập!');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    const url = `/api/admin/delete-user?id=${this.userToDeleteId}`;

    this.http.delete(url, { headers }).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== this.userToDeleteId);
        this.showDeleteConfirm = false;
        this.userToDeleteId = null;
        alert('Sách đã được xóa thành công!');
      },
      error: (err) => {
        console.error('Lỗi khi xóa sách:', err);
        alert('Đã xảy ra lỗi khi xóa sách.');
        this.showDeleteConfirm = false;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.userToDeleteId = null;
  }
}
