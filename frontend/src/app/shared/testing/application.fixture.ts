import { Application } from '../models/application.model';

export function makeApplication(overrides: Partial<Application> = {}, score = 82): Application {
  return {
    id: 1,
    status: 'SAVED',
    next_action: '',
    applied_at: '',
    interview_at: null,
    created_at: '',
    updated_at: '',
    job_offer: {
      id: 10,
      title: 'Dev Angular',
      company: 'ACME',
      location: 'Paris',
      required_skills: ['Angular'],
      ai_summary: '',
      match: { score },
    },
    ...overrides,
  } as unknown as Application;
}
