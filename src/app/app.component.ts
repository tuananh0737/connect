import { Component, OnInit, HostListener } from '@angular/core';
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
  showNotificationMenu: boolean = false;
  notifications: any[] = [];

  constructor(private router: Router, private http: HttpClient) {}

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
    this.http.get<any[]>('/api/user/notifications', { headers }).subscribe({
      next: (data) => {
        this.notifications = data;
      },
      error: () => {
        this.notifications = [];
      }
    });
  }

  toggleNotificationMenu(): void {
    this.showNotificationMenu = !this.showNotificationMenu;
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
    return date.toLocaleString(); // Định dạng ngày giờ theo ngôn ngữ của trình duyệt
  }
  
}
