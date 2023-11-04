import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SpanStatusCode, trace, context, TextMapSetter  } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';

@Injectable({
  providedIn: 'root'
})
export class MathService {

  constructor(private http: HttpClient) { }

  add(numbers: number[]): Observable<number> {    
    const apiUrl = 'http://nginx-proxy:8081/Plus';
    return this.http.post<number>(apiUrl, numbers);
}

  subtract(numbers: number[]): Observable<number> {
    const apiUrl = 'http://nginx-proxy:8081/Minus';
    return this.http.post<number>(apiUrl, numbers);
  }
}
