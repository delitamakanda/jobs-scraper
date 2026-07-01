export interface RegisterUser {
    username: string;
    password: string;
    email: string;
    password2: string;
    first_name: string;
    last_name: string;
}

export interface AuthUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}
