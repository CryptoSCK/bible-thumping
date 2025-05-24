import { describe, it, expect } from 'vitest';
import { PersonalityProfileValidator, PersonalityProfile } from './personality-profile';

describe('PersonalityProfileValidator', () => {
  const validProfile: PersonalityProfile = {
    id: 'test-profile-1',
    name: 'Test Profile',
    description: 'A detailed description of the test profile with sufficient length',
    tone: 'friendly',
    traits: ['intelligent', 'curious'],
    samplePrompts: ['Tell me about science', 'Explain quantum physics'],
    version: '1.0.0'
  };

  it('should validate a valid profile', () => {
    const errors = PersonalityProfileValidator.validate(validProfile);
    expect(errors.length).toBe(0);
    expect(PersonalityProfileValidator.isValid(validProfile)).toBe(true);
  });

  it('should reject profile with missing ID', () => {
    const profileWithoutId = { ...validProfile, id: '' };
    const errors = PersonalityProfileValidator.validate(profileWithoutId);
    expect(errors).toContain('Profile ID is required');
  });

  it('should reject profile with invalid name length', () => {
    const shortNameProfile = { ...validProfile, name: 'A' };
    const longNameProfile = { ...validProfile, name: 'A'.repeat(51) };
    
    const shortNameErrors = PersonalityProfileValidator.validate(shortNameProfile);
    const longNameErrors = PersonalityProfileValidator.validate(longNameProfile);
    
    expect(shortNameErrors).toContain('Name must be between 2 and 50 characters');
    expect(longNameErrors).toContain('Name must be between 2 and 50 characters');
  });

  it('should reject profile with invalid tone', () => {
    const invalidToneProfile = { ...validProfile, tone: 'bizarre' };
    const errors = PersonalityProfileValidator.validate(invalidToneProfile);
    expect(errors).toContain('Tone must be one of: formal, casual, academic, friendly, professional');
  });

  it('should reject profile with too many or no traits', () => {
    const noTraitsProfile = { ...validProfile, traits: [] };
    const manyTraitsProfile = { ...validProfile, traits: new Array(11).fill('trait') };
    
    const noTraitsErrors = PersonalityProfileValidator.validate(noTraitsProfile);
    const manyTraitsErrors = PersonalityProfileValidator.validate(manyTraitsProfile);
    
    expect(noTraitsErrors).toContain('Traits must have between 1 and 10 characteristics');
    expect(manyTraitsErrors).toContain('Traits must have between 1 and 10 characteristics');
  });

  it('should reject profile with invalid version', () => {
    const invalidVersionProfile = { ...validProfile, version: '1.0' };
    const errors = PersonalityProfileValidator.validate(invalidVersionProfile);
    expect(errors).toContain('Version must be in semantic versioning format (e.g., 1.0.0)');
  });
});