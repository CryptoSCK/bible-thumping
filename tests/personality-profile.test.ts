import { describe, it, expect } from 'vitest';
import { isValidPersonalityProfile, validatePersonalityProfile } from '../src/schemas/personality-profile';

const validProfile = {
    id: 'test-profile-1',
    name: 'Philosophical Assistant',
    traits: {
        openness: 9,
        conscientiousness: 7,
        extraversion: 6,
        agreeableness: 8,
        neuroticism: 4
    },
    createdAt: new Date().toISOString(),
    version: '1.0.0'
};

describe('Personality Profile Validation', () => {
    it('should validate a complete, correct profile', () => {
        expect(isValidPersonalityProfile(validProfile)).toBe(true);
        expect(validatePersonalityProfile(validProfile)).toHaveLength(0);
    });

    it('should reject profile with invalid ID', () => {
        const invalidProfile = {...validProfile, id: '!'};
        expect(isValidPersonalityProfile(invalidProfile)).toBe(false);
        const errors = validatePersonalityProfile(invalidProfile);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain('id');
    });

    it('should reject profile with out-of-range trait values', () => {
        const invalidTraitsProfile = {
            ...validProfile,
            traits: {
                ...validProfile.traits,
                openness: 11  // Over max of 10
            }
        };
        expect(isValidPersonalityProfile(invalidTraitsProfile)).toBe(false);
    });

    it('should reject profile missing required fields', () => {
        const incompleteProfile = { 
            id: 'test-profile-2', 
            name: 'Incomplete Profile' 
        };
        expect(isValidPersonalityProfile(incompleteProfile as any)).toBe(false);
    });
});