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
    id: number; 
    fullname: string;
    nationality: string;
  };
  genres: {
    id: number; 
    name: string;
  };
}

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  books: Book[] = [];
  originalBooks: Book[] = [];
  selectedBook: Book | null = null;
  showOutOfStock: boolean = false;
  searchQuery: string = '';
  updateSuccessful: boolean = false;

  showAddBookForm: boolean = false; 

  newBook: Book = {
    id: 0,
    name: '',
    numberPage: 0,
    publishYear: 0,
    description: '',
    quantity: 0,
    author: { id: 0, fullname: '', nationality: '' },
    genres: { id: 0, name: '' }
  };

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

    this.books = this.originalBooks.filter((book) =>
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

  openAddBookForm(): void {
    this.showAddBookForm = true;
  }

  closeAddBookForm(): void {
    this.showAddBookForm = false;
    this.resetNewBookForm();
  }

  resetNewBookForm(): void {
    this.newBook = {
      id: 0,
      name: '',
      numberPage: 0,
      publishYear: 0,
      description: '',
      quantity: 0,
      author: { id: 0, fullname: '', nationality: '' },
      genres: { id: 0, name: '' }
    };
  }

  addBook(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Bạn chưa đăng nhập!');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    const url = '/api/admin/add-update-book';

    this.http.post<Book>(url, this.newBook, { headers }).subscribe({
      next: (response) => {
        const existingAuthorIndex = this.books.findIndex(book => book.id === response.id);
        if (existingAuthorIndex !== -1) {
          this.books[existingAuthorIndex] = response;
        } else {
          this.books.push(response);
        }
        this.closeAddBookForm();
        this.updateSuccessful = true;
      },
      error: (err) => {
        console.error('Lỗi khi thêm sách:', err);
        alert('Đã xảy ra lỗi khi thêm sách.');
      }
    });
  }

  openEditBookForm(book: Book): void {
    this.newBook = { ...book };
    this.showAddBookForm = true;
  }

  showDeleteConfirm: boolean = false;
  bookToDeleteId: number | null = null;

  deleteBook(bookId: number): void {
    const book = this.books.find((b) => b.id === bookId);
    if (book) {
      this.bookToDeleteId = bookId;
      this.showDeleteConfirm = true;
    }
  }

  confirmDelete(): void {
    if (!this.bookToDeleteId) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Bạn chưa đăng nhập!');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    const url = `/api/admin/delete-book?id=${this.bookToDeleteId}`;

    this.http.delete(url, { headers }).subscribe({
      next: () => {
        this.books = this.books.filter((b) => b.id !== this.bookToDeleteId);
        this.showDeleteConfirm = false;
        this.bookToDeleteId = null;
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
    this.bookToDeleteId = null;
  }

  cancel(): void {
    this.updateSuccessful = false;
  }
}
