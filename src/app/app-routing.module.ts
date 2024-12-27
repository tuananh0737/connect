import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
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
import { DeCodeQRComponent } from './librarian/de-code-qr/de-code-qr.component';
import { BookLibrarianComponent } from './librarian/book/book.component';
import { LibrarianComponent } from './admin/librarian/librarian.component';
import { BorrowComponent } from './librarian/borrow/borrow.component';

const routes: Routes = [
  {
    path: 'booklist',
    component: BookListComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  }, 
  {
    path: 'sign-up',
    component: SignUpComponent,
  }, 
  {
    path: 'mybook',
    component: MybookComponent,
  },
  {
    path: 'borrow',
    component: BorrowBookComponent,
  },
  {
    path: 'user-info',
    component: UserInfoComponent,
  },
  {
    path: 'comment',
    component: CommentComponent,
  },
  {
    path: 'admin/book',
    component: BookComponent,
  },
  {
    path: 'admin/author',
    component: AuthorComponent,
  },
  {
    path: 'admin/genre',
    component: GenreComponent,
  },
  {
    path: 'admin/book',
    component: BookComponent,
  },
  {
    path: 'admin/admin-home',
    component: AdminHomeComponent,
  },
  {
    path: 'admin/user',
    component: UserComponent,
  },
  {
    path: 'admin/librarian',
    component: LibrarianComponent,
  },
  {
    path: 'decodeQr',
    component: DecodeQrComponent,
  },
  {
    path: 'librarian/deCodeQR',
    component: DeCodeQRComponent,
  },
  {
    path: 'librarian/book',
    component: BookLibrarianComponent,
  },
  {
    path: 'librarian/borrow',
    component: BorrowComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
