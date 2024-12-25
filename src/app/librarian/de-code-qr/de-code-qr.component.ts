import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-de-code-qr',
  templateUrl: './de-code-qr.component.html',
  styleUrls: ['./de-code-qr.component.css']
})
export class DeCodeQRComponent implements OnInit {

  qrResult: any = null; 
  isScanning: boolean = true; 
  bookDetails$: BehaviorSubject<any> = new BehaviorSubject(null); 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  onCodeResult(result: string): void {
    this.qrResult = result;
    this.isScanning = false; 
    this.fetchBookDetails(result); 
  }

  fetchBookDetails(qrCode: string): void {
    const url = `/api/public/find-book-by-qr`;
    this.http.post(url, { qrCode }).subscribe(
      (response) => {
        this.bookDetails$.next(response);
      },
      (error) => {
        console.error('Error fetching book details:', error);
        this.bookDetails$.next(null); 
      }
    );
  }


  restartScanning(): void {
    this.qrResult = null;
    this.isScanning = true;
  }
}
