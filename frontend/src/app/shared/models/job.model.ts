import { RegisterUser } from "./auth.model";

export interface JobOffer {
    id: number;
    source: string;
    user: RegisterUser;
    title: string;
    description: string;
    url: string;

    company: string;
    
    raw_description: string;
    location: string;
    remote_policy: string;
    contract_type: string;
    required_skills: string[];
    nice_to_have_skills: string[];
    extracted_skills: string[];

    seniority: string;
    business_domain: string;

    ai_summary: string;
    red_flag: string[];

    created_at: string;
    updated_at: string;
}

export interface JobMatch {
    job_offer: JobOffer;
    score: number;
    strengths: string[];
    weaknesses: string[];
    missing_skills: string[];
    recommendations: string[];
    generated_pitch: string;
    generated_cover_letter: string;
    created_at: string;
}