import { JobOffer } from "./job.model";

export type ApplicationStatus = 'SAVED' | 'APPLIED' | 'INTERVIEWED' | 'OFFER' | 'REJECTED';

export interface Application {
    id: number;
    job_offer: JobOffer;

    status: ApplicationStatus;
    notes?: string;
    next_action: string;
    applied_at: string;
    interview_at: string | null;
    created_at: string;
    updated_at: string;
}