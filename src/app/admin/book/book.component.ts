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
  showBorrowBook: boolean = false;
  users: { id: number; fullname: string; idCard: string; phone: string  }[] = [];
  userSearchQuery: string = '';
  selectedUserId: number | null = null;

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


  borrow(book: Book): void {
    this.selectedBook = book;
    this.showBorrowBook = true;
    this.userSearchQuery = '';
    this.users = [];
  }

  searchUser(): void {
    const query = this.userSearchQuery.trim();
    if (!query) {
      alert('Vui lòng nhập từ khóa để tìm kiếm người dùng!');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Bạn chưa đăng nhập!');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    const url = `/api/admin/search-user`;

    this.http
      .post<{ id: number; fullname: string; idCard: string; phone: string }[]>(
        url,
        { param: query },
        { headers }
      )
      .subscribe({
        next: (data) => {
          this.users = data;
          if (this.users.length === 0) {
            alert('Không tìm thấy người dùng nào.');
          }
        },
        error: (err) => {
          console.error('Lỗi khi tìm kiếm người dùng:', err);
        },
      });
  }

  selectUser(userId: number): void {
    this.selectedUserId = userId;
    alert(`Người dùng với ID ${userId} đã được chọn.`);
  }

  confirmBorrow(): void {
    if (!this.selectedUserId || !this.selectedBook) {
      alert('Vui lòng chọn sách và người dùng!');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Bạn chưa đăng nhập!');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    const url = `/api/admin/add-borrowBook`;

    const borrowData = {
      user: { id: this.selectedUserId },
      book: { id: this.selectedBook.id },
    };

    this.http.post(url, borrowData, { headers }).subscribe({
      next: () => {
        alert('Mượn sách thành công!');
        this.showBorrowBook = false;
        this.selectedUserId = null;
      },
      error: (err) => {
        console.error('Lỗi khi mượn sách:', err);
      },
    });
  }

  closeBorrowBookForm(): void {
    this.showBorrowBook = false;
    this.selectedBook = null;
    this.selectedUserId = null;
  }

  
  trackByBookId(index: number, book: Book): number {
    return book.id;
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
    this.resetNewBookForm();
    this.showAddBookForm = true;
  }
  
  closeAddBookForm(): void {
    this.showAddBookForm = false;
  }
  
  saveNewBook(): void {
    if (this.validateBook(this.newBook)) {
      if (this.newBook.id) {
        this.updateBook();
      } else {
        this.addBook();
      }
    } else {
      alert('Vui lòng điền tất cả các trường bắt buộc.');
    }
  }
  
  private validateBook(book: Book): boolean {
    return (
      !!book.name &&
      !!book.author.fullname &&
      !!book.genres.name &&
      book.numberPage > 0 &&
      book.publishYear > 0 &&
      !!book.description &&
      book.quantity > 0
    );
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
        this.books.push(response);
        alert(`Sách "${response.name}" đã được thêm thành công!`);
        this.closeAddBookForm();
      },
      error: (err) => {
        console.error('Lỗi khi thêm sách:', err);
        alert('Đã xảy ra lỗi khi thêm sách.');
      },
    });
  }
  
  openEditBookForm(book: Book): void {
    this.newBook = { ...book };
    this.showAddBookForm = true;
  }
  
  updateBook(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Bạn chưa đăng nhập!');
      return;
    }
  
    const headers = { Authorization: `Bearer ${token}` };
    const url = `/api/admin/add-update-book`;
  
    this.http.put<Book>(url, this.newBook, { headers }).subscribe({
      next: (response) => {
        const index = this.books.findIndex((b) => b.id === response.id);
        if (index !== -1) {
          this.books[index] = response;
          alert(`Sách "${response.name}" đã được cập nhật thành công!`);
        }
        this.closeAddBookForm();
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật sách:', err);
        alert('Đã xảy ra lỗi khi cập nhật sách.');
      },
    });
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
      genres: { id: 0, name: '' },
    };
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
