import { Component, OnInit } from '@angular/core';
import { CommentService } from '../services/comment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  comments: any[] = [];

  constructor(private commentService: CommentService, private router: Router) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.commentService.getComments().subscribe((data) => {
      this.comments = data;
    });
  }

  deleteComment(commentId: number) {
    this.commentService.deleteComment(commentId).subscribe(() => {
      this.comments = this.comments.filter(comment => comment.id !== commentId);
    });
  }

  viewBookDetails(bookName: string) {
    // Chuyển hướng đến trang chi tiết sách (ví dụ: sử dụng tên sách làm URL)
    this.router.navigate(['/book-details', bookName]);
  }
}
