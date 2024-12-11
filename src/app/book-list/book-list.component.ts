import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Book {
  id: number;
  name: string;
  numberPage: number;
  publishYear: number;
  description: string;
  quantity: number;
  author: {
    fullname: string;
    nationality: string;
  };
  genres: {
    name: string;
  };
}

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = []; 
  originalBooks: Book[] = []; 
  selectedBook: Book | null = null;
  showOutOfStock = false;
  searchQuery: string = ''; 

  constructor(
    private bookService: BookService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => {         
        this.books = data; 
        this.originalBooks = [...data]; 
      },
      error: (err) => {
        console.error('Lỗi khi gọi API:', err);
      }
    });
  }

  borrow(): void {
    if (this.selectedBook) {
      if (this.selectedBook.quantity > 0) {
        this.selectedBook.quantity -= 1; 
      } else {
        this.showOutOfStock = true; 
      }
    }
  }

  showDetails(book: Book): void {
    this.selectedBook = book; 
  }

  closeForm(): void {
    this.selectedBook = null; 
  }

  closeOverlay(): void {
    this.showOutOfStock = false; 
  }

  performSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();

    if (!query) {
      alert('Vui lòng nhập từ khóa để tìm kiếm.');
      return;
    }

    this.books = this.originalBooks.filter(book =>
      book.name.toLowerCase().includes(query) ||
      book.author.fullname.toLowerCase().includes(query) ||
      book.genres.name.toLowerCase().includes(query)
    );

    if (this.books.length === 0) {
      alert('Không tìm thấy sách nào phù hợp.');
      
    }
  }

  resetSearch(): void {
    this.books = [...this.originalBooks]; 
    this.searchQuery = ''; 
  }
}
