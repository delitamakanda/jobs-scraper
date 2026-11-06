import { TestBed } from '@angular/core/testing';
import { makeApplication } from '../../../../shared/testing/application.fixture';
import { ApplicationKanbanComponent } from './application-kanban.component';

describe('ApplicationKanbanComponent', () => {
  async function setup() {
    const fixture = TestBed.createComponent(ApplicationKanbanComponent);
    fixture.componentRef.setInput('applications', [
      makeApplication({ id: 1, status: 'SAVED' }),
      makeApplication({ id: 2, status: 'APPLIED' }),
      makeApplication({ id: 3, status: 'APPLIED' }),
    ]);
    await fixture.whenStable();
    return fixture;
  }

  it('labels every column section with an existing heading', async () => {
    const fixture = await setup();
    const el = fixture.nativeElement as HTMLElement;
    const sections = el.querySelectorAll('section[aria-labelledby]');
    expect(sections.length).toBe(5);
    sections.forEach((section) => {
      const heading = el.querySelector(`#${section.getAttribute('aria-labelledby')}`);
      expect(heading?.tagName).toBe('H2');
    });
  });

  it('gives the column counter an accessible label', async () => {
    const fixture = await setup();
    const text = (fixture.nativeElement as HTMLElement).textContent!;
    expect(text).toContain('2 candidatures');
    expect(text).toContain('1 candidature');
  });

  it('emits statusChanged and announces the move when the status select changes', async () => {
    const fixture = await setup();
    const emitted: unknown[] = [];
    fixture.componentInstance.statusChanged.subscribe((e) => emitted.push(e));
    const el = fixture.nativeElement as HTMLElement;

    const select = el.querySelector('select#status-1') as HTMLSelectElement;
    expect(el.querySelector('label[for="status-1"]')?.textContent).toContain('Changer le statut');
    select.value = 'OFFER';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();

    expect(emitted.length).toBe(1);
    const event = emitted[0] as { application: { id: number; status: string }; newStatus: string };
    expect(event.newStatus).toBe('OFFER');
    expect(event.application.id).toBe(1);
    expect(event.application.status).toBe('OFFER');

    const live = el.querySelector('[aria-live="polite"]');
    expect(live?.textContent).toContain('Candidature Dev Angular déplacée vers Offer');
  });
});
