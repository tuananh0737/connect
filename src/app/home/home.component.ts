import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchQuery: string = '';
  categories = [
    { id: 1, name: 'Fiction', description: 'Explore the world of imagination' },
    { id: 2, name: 'Non-Fiction', description: 'Dive into real-world stories' },
    { id: 3, name: 'Fantasy', description: 'Discover magical adventures' },
    { id: 4, name: 'Science Fiction', description: 'Experience futuristic tales' },
  ];
  recentBooks = [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      coverUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      title: '1984',
      author: 'George Orwell',
      coverUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      coverUrl: 'https://via.placeholder.com/150',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  performSearch(): void {
    console.log('Search Query:', this.searchQuery);
  }

  navigateToCategory(categoryId: number): void {
    console.log('Navigating to category:', categoryId);
    // Implement navigation logic if necessary
  }

  viewBookDetails(bookId: number): void {
    console.log('Viewing book details:', bookId);
    // Implement navigation logic to view book details
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
