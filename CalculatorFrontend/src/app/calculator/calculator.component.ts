import { Component, ViewChild } from '@angular/core';

import { CalculationHistory } from './models/CalculationHistory';
import { MathService } from './services/math.service';
import { HistoryService } from './services/history.service';
import { EventEmitter, Output } from '@angular/core';
import { HistoryComponent } from '../history/history.component';
import { trace } from '@opentelemetry/api';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent {
  display = '';
  isLoading = false;
  httpError = false;
  httpErrorMsg = '';
  httpHistoryMsgSuccess = '';
  httpHistoryMsgError = '';

  @ViewChild(HistoryComponent) historyComponentRef!: HistoryComponent;

  onCalculationMade() {
    this.historyComponentRef.refreshHistory();
  }
  constructor(private mathService: MathService, private historyService: HistoryService) {

  }

  appendToDisplay(value: string): void {
    if ((this.display.includes('+') && value === '-') || (this.display.includes('-') && value === '+')) {
        return; // Don't append the value if it's conflicting
    }
    this.display += value;
}

disablePlusButton(): boolean {
  return this.display.includes('-');
}

disableMinusButton(): boolean {
  return this.display.includes('+');
}

clear(): void {
  this.display = '';
}

deleteLast(): void {
  this.display = this.display.slice(0, -1);
}

calculate() {
// dont run the code if there is no + or - in the input
if (!this.display.includes('+') && !this.display.includes('-')) {
  return;
}

  this.httpError = false;
  this.httpHistoryMsgSuccess = '';
  this.httpHistoryMsgError = '';
  
  const operators = this.display.split(/[0-9]+/).filter(op => op.trim() !== '');

  if (operators.includes('+')) {
    const numbers = this.display.split('+').map(n => parseInt(n.trim()));

    this.isLoading = true;
    this.mathService.add(numbers).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.display = result.toString();

        const calcHistory: CalculationHistory = {
          operation: "Addition",
          expression: numbers.join(" + "),
          result: result
      }
      this.historyComponentRef.pastCalculations.push(calcHistory);
        
      },
      error: (error) => {
        this.handleServiceError(error, numbers, 'Plus', 'Add');
      }
    });
  } else {
    const numbers = this.display.split('-').map(n => parseInt(n.trim()));

    this.isLoading = true;
    this.mathService.subtract(numbers).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.display = result.toString();

        const calcHistory: CalculationHistory = {
          operation: "Substraction",
          expression: numbers.join(" - "),
          result: result
      }
      this.historyComponentRef.pastCalculations.push(calcHistory);
      },
      error: (error) => {
        this.handleServiceError(error, numbers, 'Minus', 'Subtract');
      }
    });
  }
}

handleServiceError(error: any, numbers: number[], service: 'Plus' | 'Minus', operationType: 'Add' | 'Subtract') {
  this.isLoading = false;
  this.httpError = true;
  this.httpErrorMsg = `Could not get a response from ${service}service. You got a response from the client-side instead.`;
  console.error(`Error occurred for ${service.toLowerCase()}service:`, error);
  this.attemptCallToHistoryService(numbers, operationType);
}

attemptCallToHistoryService(numbers: number[], operationType: 'Add' | 'Subtract'): void {
  try {
    const result = eval(this.display);
    this.display = result.toString();

    const operationName = operationType === 'Add' ? "Addition" : "Subtraction";
    const operatorSymbol = operationType === 'Add' ? " + " : " - ";
    const calcHistory : CalculationHistory = {
      operation: operationName,
      expression: numbers.join(operatorSymbol),
      result: result
    }
    this.historyComponentRef.pastCalculations.push(calcHistory);


    this.historyService.postHistory(calcHistory).subscribe({
      next:() => {
        this.httpHistoryMsgSuccess = "Successfully posted the result to HistoryService anyway!";
      },
      error: (error) => {
        this.httpHistoryMsgError = "Could not reach the history service either. The result was NOT stored in the history DB.";
        console.error('Error occurred for historyservice:', error);
      }
    });
  } catch (error) {
    this.display = 'Error';
  }
}
restrictInput(event: any): boolean {
  const allowedChars = '0123456789+-';
  if (allowedChars.indexOf(event.key) !== -1) {
      if ((this.display.includes('+') && event.key === '-') || (this.display.includes('-') && event.key === '+')) {
          event.preventDefault();
          return false;
      }
      return true;
  }
  event.preventDefault();
  return false;
}


}
