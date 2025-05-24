import { describe, it, expect } from 'vitest';
import { validatePersonalityProfile, isValidPersonalityProfile, PersonalityProfile } from './personality-validator';

describe('Personality Profile Validation', () => {
  const validProfile: PersonalityProfile = {
    id: 'profile_001',
    name: 'Wise Mentor',
    tone: 'serious',
    description: 'A knowledgeable and patient guide who offers deep insights.',
    traits: ['wise', 'patient', 'insightful'],
    samplePrompts: ['Tell me about leadership', 'What is true wisdom?']
  };

  it('should validate a correct profile', () => {
    const errors = validatePersonalityProfile(validProfile);
    expect(errors).toHaveLength(0);
    expect(isValidPersonalityProfile(validProfile)).toBe(true);
  });

  it('should reject profile with missing ID', () => {
    const invalidProfile = { ...validProfile, id: '' };
    const errors = validatePersonalityProfile(invalidProfile);
    expect(errors).toContain('ID is required');
  });

  it('should reject profile with invalid name', () => {
    const invalidProfile = { ...validProfile, name: '' };
    const errors = validatePersonalityProfile(invalidProfile);
    expect(errors).toContain('Name is required');
  });

  it('should reject profile with invalid tone', () => {
    const invalidProfile = { ...validProfile, tone: 'unknown' };
    const errors = validatePersonalityProfile(invalidProfile);
    expect(errors).toContain('Tone must be one of: serious, playful, sarcastic, empathetic, analytical');
  });

  it('should reject profile with short description', () => {
    const invalidProfile = { ...validProfile, description: 'Too short' };
    const errors = validatePersonalityProfile(invalidProfile);
    expect(errors).toContain('Description must be between 10 and 500 characters');
  });

  it('should reject profile with too many traits', () => {
    const invalidProfile = {
      ...validProfile,
      traits: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
    };
    const errors = validatePersonalityProfile(invalidProfile);
    expect(errors).toContain('Maximum of 10 traits allowed');
  });

  it('should reject profile with too many sample prompts', () => {
    const invalidProfile = {
      ...validProfile,
      samplePrompts: ['1', '2', '3', '4', '5', '6']
    };
    const errors = validatePersonalityProfile(invalidProfile);
    expect(errors).toContain('Maximum of 5 sample prompts allowed');
  });
});