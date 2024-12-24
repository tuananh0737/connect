import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-decode-qr',
  templateUrl: './decode-qr.component.html',
  styleUrls: ['./decode-qr.component.css']
})
export class DecodeQrComponent {
  scan: boolean = false;
  bookInfo: any;

  constructor(private http: HttpClient) {}

  toggleScanner() {
    this.scan = !this.scan;
  }

  handleScan(result: string) {
    if (result) {
      const formData: FormData = new FormData();
      const blob = new Blob([result], { type: 'image/png' });
      formData.append('qrCode', blob, 'qrcode.png');

      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');

      this.http.post('/api/public/find-book-by-qr', formData, { headers })
        .subscribe((response: any) => {
          this.bookInfo = response;
        }, error => {
          console.error('Error decoding QR code:', error);
        });
    }
  }
}
