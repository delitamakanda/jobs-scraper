import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from '@app/core/services/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  private readonly loadingService = inject(LoadingService);

  protected readonly title = signal('frontend');

  protected readonly loading = this.loadingService.loading;
}
