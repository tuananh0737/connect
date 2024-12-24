import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Author {
  id: number;
  fullname: string;
  address: string;
  birthDay: string;
  nationality: string;
}

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {
  authors: Author[] = [];
  selectAuthor: Author | null = null;
  showAddAuthorForm: boolean = false;
  updateSuccessful: boolean = false;
  searchQuery: string = '' ;

  newAuthor: Author = {
    id: 0,
    fullname: '',
    address: '',
    birthDay: '',
    nationality: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Author[]>('http://localhost:8081/api/public/find-all-author').subscribe({
      next: (data) => {
        this.authors = data;
      },
      error: (err) => {
        console.error('Lỗi khi gọi API:', err);
      }
    });
  }

  performSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();
    const url = "http://localhost:8081/api/public/search-author";
  
    this.http.post<Author[]>(url, {param: query}).subscribe({
      next:(data)=> {
        this.authors = data;
      },
      error:(err) => {
        console.error("Lỗi khi tìm kiếm");
        alert("Lỗi")
      },
    })
  }

  openAddAuthorForm(): void {
    this.showAddAuthorForm = true;
  }

  closeAddAuthorForm(): void {
    this.showAddAuthorForm = false;
    this.resetNewAuthorForm();
  }

  resetNewAuthorForm(): void {
    this.newAuthor = {
      id: 0,
      fullname: '',
      address: '',
      birthDay: '',
      nationality: ''
    };
  }

  addAuthor(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Bạn chưa đăng nhập!');
      return;
    }
  
    const headers = { Authorization: `Bearer ${token}` };
    const url = 'api/admin/add-update-author';
  
    this.http.post<Author>(url, this.newAuthor, { headers }).subscribe({
      next: (response) => {
        const existingAuthorIndex = this.authors.findIndex(author => author.id === response.id);
        if (existingAuthorIndex !== -1) {
          this.authors[existingAuthorIndex] = response;
        } else {
          this.authors.push(response);
        }
        this.closeAddAuthorForm();
        this.updateSuccessful = true;
      },
      error: (err) => {
        console.error('Lỗi khi thêm/cập nhật tác giả:', err);
        alert('Đã xảy ra lỗi khi thêm/cập nhật tác giả.');
      }
    });
  }

  cancel(): void {
    this.updateSuccessful = false
  }
  

  openEditAuthorForm(author: Author): void {
    this.newAuthor = {...author};
    this.showAddAuthorForm = true;
  }

  showDeleteConfirm: boolean = false;
  authorToDeleteId: number | null = null;
  deleteSuccessful: boolean = false;

  deleteAuthor(authorId: number): void {
    const genre = this.authors.find((a) => a.id === authorId);
    if (genre) {
      this.authorToDeleteId = authorId;
      this.showDeleteConfirm = true;
    }
  }
    
  confirmDelete(): void {
    if(!this.authorToDeleteId) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Bạn chưa đăng nhập');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    const url = `/api/admin/delete-author?id=${this.authorToDeleteId}`;

    this.http.delete(url, {headers}).subscribe({
      next:() => {
        this.authors = this.authors.filter((a) => a.id !== this.authorToDeleteId);
        this.showAddAuthorForm = false;
        this.authorToDeleteId = null;
        this.deleteSuccessful = true;
      },
      error: (err) => {
        console.error('Lỗi khi xóa thể loại: ', err);
        alert('Đã xảy ra lỗi khi xóa thể loại.');
        this.showDeleteConfirm = false; 
      },
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.authorToDeleteId = null;
    this.deleteSuccessful = false;
  }
}