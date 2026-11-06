import { TestBed } from '@angular/core/testing';
import { makeApplication } from '../../../../shared/testing/application.fixture';
import { ApplicationCardComponent } from './application-card.component';

describe('ApplicationCardComponent', () => {
  it('gives the score badge an accessible text including the percentage', async () => {
    const fixture = TestBed.createComponent(ApplicationCardComponent);
    fixture.componentRef.setInput('application', makeApplication());
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent!.replace(/\s+/g, ' ');
    expect(text).toContain('Score de correspondance : 82');
    expect(text).toMatch(/82\s*%/);
  });

  it('names the action buttons after the job offer', async () => {
    const fixture = TestBed.createComponent(ApplicationCardComponent);
    fixture.componentRef.setInput('application', makeApplication());
    await fixture.whenStable();
    const labels = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button'),
    ).map((b) => b.getAttribute('aria-label'));
    expect(labels).toEqual(['Cover letter – Dev Angular', 'Prep – Dev Angular']);
  });
});
