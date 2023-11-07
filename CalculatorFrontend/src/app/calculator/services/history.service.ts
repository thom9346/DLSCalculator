import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalculationHistory } from '../models/CalculationHistory';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private apiUrl = 'http://localhost:8081/History';
  constructor(private http: HttpClient) { }

  postHistory(calculationHistory: CalculationHistory) {
    return this.http.post<number>(this.apiUrl, calculationHistory);
  }
  getHistory(): Observable<CalculationHistory[]> {
    return this.http.get<CalculationHistory[]>(this.apiUrl);
  }
}
