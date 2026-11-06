import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthStore } from '../../state/auth.store';
import { ShellComponent } from './shell.component';

describe('ShellComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [
        provideRouter([]),
        { provide: AuthStore, useValue: { isLoggedIn: signal(false) } },
      ],
    }).compileComponents();
  });

  it('renders a skip link as first focusable element pointing to #main-content', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const first = el.querySelector('a, button') as HTMLAnchorElement;
    expect(first.getAttribute('href')).toBe('#main-content');
    expect(first.textContent).toContain('Aller au contenu principal');
    expect(el.querySelector('main#main-content')).not.toBeNull();
  });

  it('moves focus to main when the skip link is activated', async () => {
    const fixture = TestBed.createComponent(ShellComponent);
    document.body.appendChild(fixture.nativeElement);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    (el.querySelector('a[href="#main-content"]') as HTMLAnchorElement).click();
    expect(document.activeElement).toBe(el.querySelector('main#main-content'));
    fixture.nativeElement.remove();
  });
});
