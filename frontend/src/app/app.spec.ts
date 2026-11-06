import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { LoadingService } from './core/services/loading.service';

describe('App', () => {
  const loading = signal(false);

  beforeEach(async () => {
    loading.set(false);
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), { provide: LoadingService, useValue: { loading } }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should not render a hidden h1', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')).toBeNull();
  });

  it('should announce the loading overlay with role="status"', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[role="status"]')).toBeNull();

    loading.set(true);
    await fixture.whenStable();
    const status = root.querySelector('[role="status"]');
    expect(status?.textContent).toContain('Chargement en cours');
  });
});
