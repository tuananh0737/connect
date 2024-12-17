import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-mybook',
  templateUrl: './mybook.component.html',
  styleUrls: ['./mybook.component.css']
})
export class MybookComponent implements OnInit {
  bookmarks: any[] = [];
  errorMessage: string = '';
  isDeleteOverlayVisible: boolean = false;
  selectedBookmark: any = null; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.fetchBookmarks(token);
    } else {
      this.errorMessage = 'Đăng nhập để tiếp tục.';
    }
  }

  fetchBookmarks(token: string): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get('/api/user/find-bookmark-by-user', { headers }).subscribe({
      next: (response: any) => {
        this.bookmarks = response;
      },
      error: (error) => {
        this.errorMessage = error.error?.errorMessage || 'Lỗi khi tải danh sách';
        console.error('Error:', error);
      }
    });
  }

  openDeleteOverlay(bookmark: any): void {
    this.selectedBookmark = bookmark; 
    this.isDeleteOverlayVisible = true;
  }

  closeDeleteOverlay(): void {
    this.isDeleteOverlayVisible = false; 
    this.selectedBookmark = null; 
  }

  deleteBook(bookmarkId: string): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.errorMessage = 'Bạn cần đăng nhập lại để xóa mục yêu thích.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.delete(`/api/user/delete-bookmark?id=${bookmarkId}`, { headers }).subscribe({
      next: () => {
        this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== bookmarkId); 
        this.closeDeleteOverlay(); 
        this.errorMessage = ''; 
      },
      error: (error) => {
        this.errorMessage = error.error?.errorMessage || 'Lỗi khi xóa mục yêu thích';
        console.error('Error:', error);
      }
    });
  }
}
