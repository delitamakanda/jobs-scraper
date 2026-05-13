import { RegisterUser } from "./auth.model";

export interface Profile {
    user: RegisterUser;
    title: string;
    summary: string;
    years_of_experience: number;
    seniority: string;
    
    main_skills: string[];
    secondary_skills: string[];
    industries: string[];
    projects: string[];

    preferred_locations: string[];
    remote_preference: string;

    target_salary_min: number;
    target_salary_max: number;

    linkedin_url: string;
    github_url: string;

    created_at: string;
    updated_at: string;
}