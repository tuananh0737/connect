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
  idCard: string;
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
  selectedUser: User | null = null;
  showEditForm: boolean = false;

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

  openEditUserForm(user: User): void {
    this.selectedUser = { ...user };
    this.showEditForm = true;
  }
  
  errorMessage: string | null = null; 

  saveUser(): void {
    if (!this.selectedUser) return;
  
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.errorMessage = 'Bạn chưa đăng nhập!';
      return;
    }
  
    const headers = { Authorization: `Bearer ${token}` };
    const url = '/api/admin/update-user';
  
    this.http.post<User>(url, this.selectedUser, { headers }).subscribe({
      next: (data) => {
        const index = this.users.findIndex((u) => u.id === this.selectedUser?.id);
        if (index !== -1) {
          this.users[index] = data;
        }
        this.closeEditForm();
        alert('Cập nhật người dùng thành công!');
      },
      error: (err) => {
        if (err.error) {
          this.errorMessage = err.error; 
        } else {
          this.errorMessage = 'Đã xảy ra lỗi khi cập nhật người dùng.';
        }
      },
    });
  }
  
  closeEditForm(): void {
    this.showEditForm = false;
    this.selectedUser = null;
    this.errorMessage = null;
  }
}
