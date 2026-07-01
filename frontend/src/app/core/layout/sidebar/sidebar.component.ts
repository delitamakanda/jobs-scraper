import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../state/auth.store';
import { MATERIAL_IMPORTS } from '../../../shared/ui/material.imports';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, ...MATERIAL_IMPORTS],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  private readonly router = inject(Router);
  readonly store = inject(AuthStore);

  logout() {
    this.store.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        // Optionally show error message to the user
      }
    });
  }
}
