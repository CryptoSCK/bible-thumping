import Ajv from 'ajv';
import personalityProfileSchema from './personality-profile.schema.json';

export interface PersonalityProfile {
    id: string;
    name: string;
    description?: string;
    traits: {
        openness: number;
        conscientiousness: number;
        extraversion: number;
        agreeableness: number;
        neuroticism: number;
    };
    conversationStyles?: string[];
    knowledgeDomains?: string[];
    languagePreferences?: {
        primaryLanguage: string;
        additionalLanguages?: string[];
    };
    interactionConstraints?: {
        tone?: 'professional' | 'friendly' | 'academic' | 'playful';
        responsiveness?: number;
    };
    createdAt: string;
    version: string;
}

const ajv = new Ajv();
const validate = ajv.compile(personalityProfileSchema);

export function isValidPersonalityProfile(profile: PersonalityProfile): boolean {
    return validate(profile) as boolean;
}

export function validatePersonalityProfile(profile: PersonalityProfile): string[] {
    const valid = validate(profile);
    return valid ? [] : (validate.errors || []).map(err => `${err.instancePath} ${err.message}`);
}