import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShellComponent } from './core/layout/shell/shell.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ShellComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('frontend');
}
