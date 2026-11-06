import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthStore } from '../../../core/state/auth.store';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  const error = signal<string | null>(null);

  beforeEach(async () => {
    error.set(null);
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [provideRouter([]), { provide: AuthStore, useValue: { error } }],
    }).compileComponents();
  });

  it('renders the store error inside a role="alert" region', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[role="alert"]')?.textContent?.trim()).toBe('');

    error.set('Identifiants invalides');
    await fixture.whenStable();
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('Identifiants invalides');
  });

  it('sets autocomplete hints on credentials fields', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(
      el.querySelector('input[formControlName="username"]')?.getAttribute('autocomplete'),
    ).toBe('username');
    expect(
      el.querySelector('input[formControlName="password"]')?.getAttribute('autocomplete'),
    ).toBe('current-password');
  });
});
