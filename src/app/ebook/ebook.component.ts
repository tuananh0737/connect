import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-ebook',
  templateUrl: './ebook.component.html',
  styleUrls: ['./ebook.component.css']
})
export class EbookComponent {
  searchQuery: string = '';
  books: any[] = [];
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  searchBooks() {
    if (!this.searchQuery.trim()) {
      alert('Vui lòng nhập từ khóa tìm kiếm!');
      return;
    }
  
    this.loading = true;
  
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(this.searchQuery)}`;
    this.http.get(apiUrl).subscribe(
      (response: any) => {
        this.books = (response.items || []).map((item: any) => ({
          title: item.volumeInfo.title || 'Không rõ',
          author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Không rõ',
          coverId: item.volumeInfo.imageLinks?.thumbnail || null,
          previewLink: item.volumeInfo.previewLink || null,
        }));
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching books:', error);
        alert('Đã xảy ra lỗi khi tìm kiếm sách. Vui lòng thử lại!');
        this.loading = false;
      }
    );
  }
  
}
