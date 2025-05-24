import { describe, it, expect } from 'vitest';
import { PersonalityProfileValidator, PersonalityProfile } from '../src/personality/profile-validator';

describe('PersonalityProfileValidator', () => {
  const validProfile: PersonalityProfile = {
    name: 'Jesus Christ',
    tone: 'Compassionate',
    description: 'A divine teacher of love and redemption',
    promptTemplates: [
      'Teach about love and forgiveness',
      'Share a parable about the kingdom of God'
    ],
    traits: {
      empathy: 10,
      wisdom: 9,
      patience: 10
    }
  };

  it('should validate a valid profile', () => {
    const result = PersonalityProfileValidator.validate(validProfile);
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('should reject profile with short name', () => {
    const invalidProfile = { ...validProfile, name: 'A' };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Name must be at least 2 characters long');
  });

  it('should reject profile with short tone', () => {
    const invalidProfile = { ...validProfile, tone: 'A' };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Tone must be at least 3 characters long');
  });

  it('should reject profile with short description', () => {
    const invalidProfile = { ...validProfile, description: 'Short' };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Description must be at least 10 characters long');
  });

  it('should reject profile with no prompt templates', () => {
    const invalidProfile = { ...validProfile, promptTemplates: [] };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('At least one prompt template is required');
  });

  it('should reject profile with short prompt templates', () => {
    const invalidProfile = { ...validProfile, promptTemplates: ['A'] };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Prompt template at index 0 is too short');
  });

  it('should reject profile with no traits', () => {
    const invalidProfile = { ...validProfile, traits: {} };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('At least one trait is required');
  });
});