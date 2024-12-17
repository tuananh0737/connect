import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  userInfo: any = null;
  errorMessage: string = '';
  showUpdate: boolean = false;
  updateForm: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      id: ['', Validators.required],
      fullname: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^\d{10}$')]],
      idCard: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.fetchUserInfo(token);      
    } else {
      this.errorMessage = 'No token found. Please login first.';
    }
  }

  update(): void {
    this.showUpdate = true;
    if (this.userInfo) {
      this.updateForm.patchValue(this.userInfo);
    }
  }

  submitUpdate(): void {
    // if (this.updateForm.invalid) {
    //   alert('Vui lòng điền đầy đủ thông tin.');
    //   return;
    // }

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Bạn cần đăng nhập để cập nhật thông tin.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');
    this.http.post('api/user/update-info', this.updateForm.value, { headers }).subscribe({
      next: () => {
        alert('Cập nhật thông tin thành công.');
        this.showUpdate = false;
        this.fetchUserInfo(token);
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Không thể cập nhật thông tin.';
        console.error('Lỗi khi cập nhật:', error);
        alert(errorMessage);
      }
    });
  }

  fetchUserInfo(token: string): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post('/api/userlogged', {}, { headers }).subscribe({
      next: (response) => {
        this.userInfo = response;
      },
      error: (error) => {
        this.errorMessage = error.error?.errorMessage || 'Failed to fetch user information';
        console.error('Error:', error);
      }
    });
  }
}
