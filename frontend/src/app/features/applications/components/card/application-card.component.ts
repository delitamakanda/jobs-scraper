import { Component, input, output } from '@angular/core';
import { Application } from '../../../../shared/models/application.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-application-card',
  imports: [DatePipe],
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.css'],
})
export class ApplicationCardComponent {
  application = input.required<Application>();

  generateCoverLetter = output<Application>();
  generateInterviewPrep = output<Application>();
  
}
