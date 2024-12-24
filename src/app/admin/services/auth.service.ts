import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrlLogin = 'http://localhost:8081/api/login';
  private apiUrlRegis = 'http://localhost:8081/api/regis';  

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<string> {
    const body = { username, password };
    return this.http.post(this.apiUrlLogin, body, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      responseType: 'text' 
    });
  }

  getErrors(): Observable<any> {
    return this.http.get<any>(this.apiUrlLogin);
  }

  signUp(username: string, password: string, fullname: string): Observable<any> {
    const body = { username, password, fullname };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrlRegis, body, { headers });
  }
}
