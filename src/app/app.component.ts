
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  userRole: string = '';
  showNotificationMenu: boolean = false;
  notifications: any[] = [];

  constructor(private router: Router, private http: HttpClient, private fb: FormBuilder) {  }

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.isLoggedIn = true;
      this.fetchUserRole(token);
      this.fetchNotifications(token);
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
      error: () => {
        this.userRole = 'ROLE_USER'; 
      }
    });
  }

  fetchNotifications(token: string): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    if(this.userRole === 'ROLE_USER') {
    this.http.get<any[]>('/api/user/notifications', { headers }).subscribe({
      next: (data) => {
        this.notifications = data;
      },
      error: () => {
          this.notifications = [];
      }
    });
  }
  }

  toggleNotificationMenu(): void {
    this.showNotificationMenu = !this.showNotificationMenu;
  }

  goToBorrowedBook(bookId: number): void {
    this.router.navigate(['/borrow'], { queryParams: { bookId } });
  }  

  logout(): void {
    localStorage.removeItem('authToken');
    this.isLoggedIn = false;
    this.userRole = 'ROLE_USER';
    this.router.navigate(['/home']);
  }

  @HostListener('document:click', ['$event'])
  closeMenu(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-link') && !target.closest('.notification-menu')) {
      this.showNotificationMenu = false;
    }
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString(); 
  }

  //doi mat khau
  oldPassword: string = '';
  newPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  overlay: boolean = false;
  reEnterNewPassword: string = '';


  openChangePasswordForm() {
    this.overlay = true;
  }

  changePassword() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.errorMessage = 'Bạn chưa đăng nhập.';
      return;
    }
  
    if (this.newPassword !== this.reEnterNewPassword) {
      this.errorMessage = 'Mật khẩu mới và mật khẩu nhập lại không khớp.';
      return;
    }
  
    if (this.newPassword.length < 8) {
      this.errorMessage = 'Mật khẩu mới phải có ít nhất 8 ký tự.';
      return;
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    const body = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    };
  
    this.http.post('/api/user/change-password', body, { headers, responseType: 'text' }).subscribe({
      next: (response: string) => {
        this.successMessage = 'Đổi mật khẩu thành công!';
        this.closeChangePasswordForm();
      },
      error: (err) => {
        if (err.status === 400) {
          this.errorMessage = 'Mật khẩu cũ không chính xác.';
        } else {
          this.errorMessage = 'Có lỗi xảy ra, vui lòng thử lại.';
        }
      }
    });
  }
  closeChangePasswordForm(){
    this.overlay = false;
  }
}