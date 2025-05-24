import { describe, it, expect } from 'vitest';
import { PersonalityProfileValidator, PersonalityProfile } from './personality-validator';

describe('PersonalityProfileValidator', () => {
  const validProfile: PersonalityProfile = {
    name: 'Jesus',
    tone: 'Compassionate',
    description: 'A divine messenger of love and forgiveness',
    samplePrompts: [
      'Tell me about love',
      'What is the meaning of compassion?'
    ]
  };

  it('should validate a valid profile', () => {
    const result = PersonalityProfileValidator.validate(validProfile);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject profile with empty name', () => {
    const invalidProfile = { ...validProfile, name: '' };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Name is required');
  });

  it('should reject profile with too short name', () => {
    const invalidProfile = { ...validProfile, name: 'A' };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Name must be at least 2 characters long');
  });

  it('should reject profile with too long name', () => {
    const invalidProfile = { 
      ...validProfile, 
      name: 'A'.repeat(51),
      constraints: { maxNameLength: 50 }
    };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Name must not exceed 50 characters');
  });

  it('should reject profile with empty tone', () => {
    const invalidProfile = { ...validProfile, tone: '' };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Tone is required');
  });

  it('should reject profile with empty description', () => {
    const invalidProfile = { ...validProfile, description: '' };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Description is required');
  });

  it('should reject profile with no sample prompts', () => {
    const invalidProfile = { ...validProfile, samplePrompts: [] };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('At least one sample prompt is required');
  });

  it('should reject profile with too many sample prompts', () => {
    const invalidProfile = { 
      ...validProfile, 
      samplePrompts: Array(11).fill('Sample prompt'),
      constraints: { maxPrompts: 10 }
    };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Cannot exceed 10 sample prompts');
  });

  it('should reject profile with empty sample prompts', () => {
    const invalidProfile = { ...validProfile, samplePrompts: ['', 'Valid prompt'] };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Sample prompt at index 0 cannot be empty');
  });
});