import { describe, it, expect } from 'vitest';
import { PersonalityProfileValidator, PersonalityProfile } from './profile-validator';

describe('PersonalityProfileValidator', () => {
  const validProfile: PersonalityProfile = {
    id: 'profile_001',
    name: 'Test Character',
    tone: 'Friendly',
    description: 'A friendly character for testing purposes',
    samplePrompts: ['Hello there!', 'How are you doing?'],
    traits: {
      intelligence: 8,
      charisma: 9
    }
  };

  it('should validate a complete, valid profile', () => {
    const errors = PersonalityProfileValidator.validate(validProfile);
    expect(errors).toHaveLength(0);
    expect(PersonalityProfileValidator.isValid(validProfile)).toBe(true);
  });

  it('should reject profile with missing ID', () => {
    const invalidProfile = { ...validProfile, id: '' };
    const errors = PersonalityProfileValidator.validate(invalidProfile);
    expect(errors).toContain('Profile ID is required and cannot be empty');
  });

  it('should reject profile with short name', () => {
    const invalidProfile = { ...validProfile, name: 'A' };
    const errors = PersonalityProfileValidator.validate(invalidProfile);
    expect(errors).toContain('Name must be at least 2 characters long');
  });

  it('should reject profile with missing tone', () => {
    const invalidProfile = { ...validProfile, tone: '' };
    const errors = PersonalityProfileValidator.validate(invalidProfile);
    expect(errors).toContain('Tone is required');
  });

  it('should reject profile with short description', () => {
    const invalidProfile = { ...validProfile, description: 'Too short' };
    const errors = PersonalityProfileValidator.validate(invalidProfile);
    expect(errors).toContain('Description must be at least 10 characters long');
  });

  it('should reject profile with no sample prompts', () => {
    const invalidProfile = { ...validProfile, samplePrompts: [] };
    const errors = PersonalityProfileValidator.validate(invalidProfile);
    expect(errors).toContain('At least one sample prompt is required');
  });

  it('should reject profile with short sample prompts', () => {
    const invalidProfile = { ...validProfile, samplePrompts: ['Hi'] };
    const errors = PersonalityProfileValidator.validate(invalidProfile);
    expect(errors).toContain('Sample prompt at index 0 is too short');
  });

  it('should reject profile with no traits', () => {
    const invalidProfile = { ...validProfile, traits: {} };
    const errors = PersonalityProfileValidator.validate(invalidProfile);
    expect(errors).toContain('At least one trait is required');
  });
});