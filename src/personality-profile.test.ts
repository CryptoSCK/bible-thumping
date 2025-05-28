import { describe, it, expect } from 'vitest';
import { validatePersonalityProfile, PersonalityProfile } from './personality-profile';

describe('PersonalityProfile Validation', () => {
  const validProfile: PersonalityProfile = {
    id: 'test-profile',
    name: 'Test Profile',
    description: 'A test personality profile',
    tone: 'friendly',
    samplePrompts: ['Hello!'],
    version: 1
  };

  it('should validate a valid profile', () => {
    const result = validatePersonalityProfile(validProfile);
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('should fail validation with empty ID', () => {
    const invalidProfile = {...validProfile, id: ''};
    const result = validatePersonalityProfile(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Profile ID is required');
  });

  it('should fail validation with empty name', () => {
    const invalidProfile = {...validProfile, name: ''};
    const result = validatePersonalityProfile(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Profile name is required');
  });

  it('should fail validation with no sample prompts', () => {
    const invalidProfile = {...validProfile, samplePrompts: []};
    const result = validatePersonalityProfile(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('At least one sample prompt is required');
  });
});