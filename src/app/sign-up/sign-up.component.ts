import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  username: string = '';
  password: string = '';
  reEnterPassword: string = ''; 
  fullname: string = '';
  loading: boolean = false;
  registrationSuccess: boolean = false; 
  showOverlay: boolean = false;
  showUsernameExistsOverlay: boolean = false; 

  constructor(private authService: AuthService, private router: Router) {}

  onSignUp() {
    if (!this.username || !this.password || !this.reEnterPassword || !this.fullname) {
      alert('Please fill in all fields');
      return;
    }

    if (this.password !== this.reEnterPassword) {
      alert('Passwords do not match');
      return;
    }

    this.loading = true; 

    this.authService.signUp(this.username, this.password, this.fullname).subscribe({
      next: (response) => {
        this.loading = false;
        if (response && response.username) {
          this.registrationSuccess = true; 
          alert('Registration Successful');
          console.log('User Info:', response); 
          this.showOverlay = true;
        } else {
          alert('Registration Failed');
        }
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 417 && error.error && error.error.errorMessage === "Tên đăng nhập đã tồn tại") {
          this.showUsernameExistsOverlay = true;
        } else {
          alert('Registration Failed');
          console.error('Error:', error);
        }
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  closeOverlay() {
    this.showUsernameExistsOverlay = false;
  }
}
