import { describe, it, expect } from 'vitest';
import { 
  PersonalityProfile, 
  PersonalityTraitType, 
  PersonalityTraitCategory, 
  validatePersonalityProfile 
} from '../src/models/personality-profile';

const validPersonalityProfile: PersonalityProfile = {
  id: 'test-profile-001',
  name: 'Test Profile',
  version: '1.0.0',
  description: 'A test personality profile',
  traits: [
    {
      type: PersonalityTraitType.Openness,
      category: PersonalityTraitCategory.Intellectual,
      score: 75,
      description: 'High openness to new ideas'
    }
  ],
  dialoguePrompts: [
    {
      context: 'Introduction scenario',
      examples: ['Hello, nice to meet you', 'Greetings!']
    }
  ],
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['test', 'demo']
  }
};

describe('Personality Profile Validation', () => {
  it('should validate a correct personality profile', () => {
    expect(validatePersonalityProfile(validPersonalityProfile)).toBe(true);
  });

  it('should reject profile with invalid trait score', () => {
    const invalidProfile = {
      ...validPersonalityProfile,
      traits: [{
        ...validPersonalityProfile.traits[0],
        score: 150  // Out of range
      }]
    };
    expect(validatePersonalityProfile(invalidProfile)).toBe(false);
  });

  it('should reject profile with missing required fields', () => {
    const incompleteProfile = { ...validPersonalityProfile };
    delete incompleteProfile.id;
    expect(validatePersonalityProfile(incompleteProfile)).toBe(false);
  });

  it('should reject profile with invalid date', () => {
    const invalidDateProfile = {
      ...validPersonalityProfile,
      metadata: {
        ...validPersonalityProfile.metadata,
        createdAt: 'invalid-date'
      }
    };
    expect(validatePersonalityProfile(invalidDateProfile)).toBe(false);
  });
});