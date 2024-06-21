// src/utils.ts
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const getEnvVariable = (key: string, defaultValue?: string): string => {
    const value = process.env[key];
    if (value === undefined || value === '') {
        if (defaultValue !== undefined) {
            return defaultValue;
        } else {
            throw new Error(`Environment variable ${key} is not set and no default value was provided`);
        }
    }
    return value;
};

