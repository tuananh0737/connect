import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookListComponent } from './book-list/book-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MybookComponent } from './mybook/mybook.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { BookComponent } from './admin/book/book.component';
import { AuthorComponent } from './admin/author/author.component';
import { GenreComponent } from './admin/genre/genre.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { UserComponent } from './admin/user/user.component';
import { BorrowBookComponent } from './borrow-book/borrow-book.component';
import { DecodeQrComponent } from './decode-qr/decode-qr.component';
import { CommentComponent } from './comment/comment.component';


@NgModule({
  declarations: [
    AppComponent,
    BookListComponent,
    HomeComponent,
    LoginComponent,
    SignUpComponent,
    MybookComponent,
    UserInfoComponent,
    BookComponent,
    AuthorComponent,
    GenreComponent,
    AdminHomeComponent,
    UserComponent,
    BorrowBookComponent,
    DecodeQrComponent,
    CommentComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ZXingScannerModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
