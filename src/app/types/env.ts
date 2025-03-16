export interface EnvCheck {
    errors?: { error_title: string; error_description: string; env_key: string }[];
}
