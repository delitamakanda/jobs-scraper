import { JobOffer } from "./job.model";

export interface Application {
    id: number;
    job_offer: JobOffer;

    status: string;
    notes: string;
    next_action: string;
    applied_at: string;
    interview_at: string | null;
    created_at: string;
    updated_at: string;
}