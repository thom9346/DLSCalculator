import { Component, OnInit } from '@angular/core';
import { CalculationHistory } from '../calculator/models/CalculationHistory';
import { HistoryService } from '../calculator/services/history.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit{

  pastCalculations: CalculationHistory[] = [];
  errorMsg = '';

  constructor(private historyService: HistoryService) {
  
  }
  refreshHistory() {
    this.ngOnInit();
  }
  ngOnInit(): void {
    this.historyService.getHistory().subscribe({
      next: (data) => {
        this.pastCalculations = data;
      },
      error: (error) => {
        console.error("Error fetching from historyService:", error);
        this.errorMsg = "Error: Can't fetch data from historyService";
      }
    });
  }

  getBoxClass(calculation: CalculationHistory): string {
    if (calculation.operation === 'Addition') {
        return 'addition-box';
    } else if (calculation.operation === 'Subtraction') {
        return 'subtraction-box';
    }
    return ''; // default case

  }


}
