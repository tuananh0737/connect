import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface Genre {
  id: number;
  name: string;
  details: string;
}

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.css']
})
export class GenreComponent implements OnInit {
  genres: Genre[] = [];
  selectedGenre: Genre | null = null;
  showAddGenreForm: boolean = false;
  updateSuccessful: boolean = false;
  deleteSuccessful: boolean = false;
  searchQuery: string = '';

  newGenre: Genre = {
    id: 0,
    name: '',
    details: ''
  };

  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.loadGenres();
 }

 performSearch(): void {
  const query = this.searchQuery.toLowerCase().trim();
  const url = "/api/public/search-genre";

  this.http.post<Genre[]>(url, {param: query}).subscribe({
    next:(data)=> {
      this.genres = data;
    },
    error:(err) => {
      console.error("Lỗi khi tìm kiếm");
      alert("Lỗi")
    },
  })
}

 openAddGenreForm(): void {
  this.showAddGenreForm = true;
 }

 closeAddGenreForm(): void {
  this.showAddGenreForm = false;
  this.resetNewGenreForm();
 }

 resetNewGenreForm(): void {
  this.newGenre = {
    id: 0,
    name: '',
    details: ''
  };
 }

 addGenre(): void {
  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('Bạn chưa đăng nhập!');
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };
  const url = 'api/admin/add-update-genres';

  this.http.post<Genre>(url, this.newGenre, { headers }).subscribe({
    next: (response) => {
      const existingGenreIndex = this.genres.findIndex(genre => genre.id === response.id);
      if (existingGenreIndex !== -1) {
        this.genres[existingGenreIndex] = response;
      } else {
        this.genres.push(response);
      }
      this.closeAddGenreForm();
      this.updateSuccessful = true;
    },
    error: (err) => {
      console.error('Lỗi khi thêm/cập nhật tác giả:', err);
      alert('Đã xảy ra lỗi khi thêm/cập nhật tác giả.');
    }
  });
}

  openEditGenreForm(genre: Genre): void {
    this.newGenre = {...genre};
    this.showAddGenreForm = true;
  }

  showDeleteConfirm: boolean = false;
  genreToDeleteId: number | null = null;

  deleteGenre(genreId: number): void {
    const genre = this.genres.find((g) => g.id === genreId);
    if (genre) {
      this.genreToDeleteId = genreId;
      this.showDeleteConfirm = true;
    }
  }
    
  confirmDelete(): void {
    if(!this.genreToDeleteId) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Bạn chưa đăng nhập');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    const url = `/api/admin/delete-genres?id=${this.genreToDeleteId}`;

    this.http.delete(url, {headers}).subscribe({
      next:() => {
        this.genres = this.genres.filter((g) => g.id !== this.genreToDeleteId);
        this.showAddGenreForm = false;
        this.genreToDeleteId = null;
        this.deleteSuccessful = true;
      },
      error: (err) => {
        console.error('Lỗi khi xóa thể loại: ', err);
        alert('Đã xảy ra lỗi khi xóa thể loại.');
        this.showDeleteConfirm = false; 
      },
    });
  }


  cancel(): void {
    this.showDeleteConfirm = false;
    this.genreToDeleteId = null;
    this.deleteSuccessful = false;
    this.updateSuccessful = false;
  }

   // phân trang
   currentPage: number = 1; 
   pageSize: number = 10; 
   paginatedGenres: Genre[] = []; 
   totalPages: number = 1; 
 
   loadGenres(): void {
     const url = '/api/public/find-all-genres';
 
     this.http.get<Genre[]>(url).subscribe({
       next: (data) => {
         this.genres = data;
         this.totalPages = Math.ceil(this.genres.length / this.pageSize); 
         this.updatePagination();
       },
       error: (err) => {
         console.error('Lỗi khi gọi API:', err);
       },
     });
   }
 
   updatePagination(): void {
     const startIndex = (this.currentPage - 1) * this.pageSize;
     const endIndex = startIndex + this.pageSize;
     this.paginatedGenres = this.genres.slice(startIndex, endIndex); 
   }
 
   goToPage(page: number): void {
     if (page < 1 || page > this.totalPages) return; 
     this.currentPage = page;
     this.updatePagination();
   }
}
