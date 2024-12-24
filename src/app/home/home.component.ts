import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  books: any[] = [];
  genres: any[] = [];
  selectedBook: any = null;

  constructor(private router: Router ,private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchBooks();
    this.fetchGenres();
  }

  fetchBooks(): void {
    const apiUrl = '/api/public/books-by-rating';
    this.http.get<any[]>(apiUrl).subscribe({
      next: (response) => {
        this.books = response.slice(0, 4); 
      },
      error: (error) => {
        console.error('Error fetching books:', error);
      }
    });
  }

  showBookDetails(book: any) {
    this.selectedBook = book;
  }

  closeForm(): void {
    this.selectedBook = null; 
  }

  fetchGenres(): void {
    const apiUrl = '/api/public/find-all-genres';
    this.http.get<any[]>(apiUrl).subscribe({
      next: (response) => {
        this.genres = this.shuffleArray(response).slice(0, 6);
      },
      error: (error) => {
        console.error('Error fetching genres:', error);
      }
    });
  }

  shuffleArray(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }
  
  navigateToBooklist(genreName: string): void {
    this.router.navigate(['/booklist'], { queryParams: { genre: genreName } });
  }
    
}
