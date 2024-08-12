// src/utils.ts
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { File } from './interfaces/OpenAIResponse';

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

export const findJsonByUrl = (expectedUrl: string, jsonArray: File[]): File | null => {
    for (const file of jsonArray) {
        let item;
        try {
            item = JSON.parse(file.Body);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            continue;
        }

        if (item.url === expectedUrl) {
            return item;
        }
    }
    return null; // Devuelve null si no encuentra coincidencias
};


