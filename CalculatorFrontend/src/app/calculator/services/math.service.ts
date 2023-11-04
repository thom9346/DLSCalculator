import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MathService {
  apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) { }

  add(numbers: number[]): Observable<number> {  
    console.log("This will be false in development, and true in production")
    console.log(environment.production);
    return this.http.post<number>(`http://plus_backend:80/Plus`, numbers);
}

  subtract(numbers: number[]): Observable<number> {
    return this.http.post<number>(`http://plus_backend:80/Minus`, numbers);
  }
}
