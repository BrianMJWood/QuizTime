import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../quiz.models';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  #http = inject(HttpClient);
  private apiUrl =
    'https://4s3b8dv81f.execute-api.eu-west-2.amazonaws.com/chat';

  constructor(private http: HttpClient) {}

  getQuestions(category: any): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      { category },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }
}
