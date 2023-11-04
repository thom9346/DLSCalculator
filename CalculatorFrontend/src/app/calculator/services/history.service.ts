import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalculationHistory } from '../models/CalculationHistory';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private apiUrl = 'http://nginx-proxy:8081/History';
  constructor(private http: HttpClient) { }

  postHistory(calculationHistory: CalculationHistory) {
    return this.http.post<number>(this.apiUrl, calculationHistory);
  }
  getHistory(): Observable<CalculationHistory[]> {
    return this.http.get<CalculationHistory[]>(this.apiUrl);
  }
}
