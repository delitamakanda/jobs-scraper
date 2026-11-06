import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
})
export class ShellComponent {
  /** `<base href="/">` makes a bare `#hash` link navigate away: focus the target manually. */
  focusMain(event: Event): void {
    event.preventDefault();
    document.getElementById('main-content')?.focus();
  }
}
