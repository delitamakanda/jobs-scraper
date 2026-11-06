import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AuthStore } from '../../state/auth.store';
import { SidebarComponent } from './sidebar.component';

@Component({ template: '' })
class DummyPage {}

describe('SidebarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideRouter([
          { path: 'dashboard', component: DummyPage },
          { path: 'jobs', component: DummyPage },
          { path: 'applications', component: DummyPage },
          { path: 'profile', component: DummyPage },
        ]),
        { provide: AuthStore, useValue: { isLoggedIn: signal(true) } },
      ],
    }).compileComponents();
  });

  it('exposes a labelled navigation landmark and no h1', async () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('nav[aria-label]')?.getAttribute('aria-label')).toBe(
      'Navigation principale',
    );
    expect(el.querySelector('h1')).toBeNull();
  });

  it('marks only the active link with aria-current="page"', async () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    await TestBed.inject(Router).navigateByUrl('/jobs');
    await fixture.whenStable();
    const current = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'a[aria-current="page"]',
    );
    expect(current.length).toBe(1);
    expect(current[0].getAttribute('href')).toBe('/jobs');
  });
});
