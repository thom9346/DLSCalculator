import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MathService {


  constructor(private http: HttpClient) { }

  add(numbers: number[]): Observable<number> {  
    return this.http.post<number>('http://localhost:8081/Plus', numbers);
  }
  subtract(numbers: number[]): Observable<number> {
    return this.http.post<number>('http://localhost:8081/Minus', numbers);
  }
  multiply(numbers: number[]): Observable<number> {
    return this.http.post<number>('http://localhost:8081/Multiply', numbers);
  }
  isMultiplyFeatureOn(): Observable<boolean> {
    return this.http.get<boolean>('http://localhost:8081/Multiply').pipe(
      map(response => {
        return response;
      })
    )
  }
}
