import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = '/api/user/comments'; // URL API của bạn

  constructor(private http: HttpClient) {}

  getComments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`/api/user/delete-comment?id=${commentId}`);
  }
}
