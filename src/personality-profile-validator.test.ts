import { describe, it, expect } from 'vitest';
import { PersonalityProfileValidator, PersonalityProfile } from './personality-profile-validator';

describe('PersonalityProfileValidator', () => {
  const validProfile: PersonalityProfile = {
    id: 'test-profile-1',
    name: 'Test Agent',
    tone: 'friendly',
    description: 'A friendly test agent for validation testing',
    samplePrompts: ['Hello, how are you?', 'Tell me a story'],
    capabilities: ['conversation', 'storytelling'],
    restrictions: ['no harmful content', 'no personal information']
  };

  it('should validate a correct profile', () => {
    const result = PersonalityProfileValidator.validate(validProfile);
    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('should fail with missing ID', () => {
    const invalidProfile = { ...validProfile, id: '' };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Profile ID is required');
  });

  it('should fail with short name', () => {
    const invalidProfile = { ...validProfile, name: 'A' };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Name must be at least 2 characters long');
  });

  it('should fail with invalid tone', () => {
    const invalidProfile = { ...validProfile, tone: 'angry' };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Tone must be one of');
  });

  it('should fail with short description', () => {
    const invalidProfile = { ...validProfile, description: 'Too short' };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Description must be at least 10 characters long');
  });

  it('should fail with no sample prompts', () => {
    const invalidProfile = { ...validProfile, samplePrompts: [] };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('At least one sample prompt is required');
  });

  it('should fail with short sample prompts', () => {
    const invalidProfile = { ...validProfile, samplePrompts: ['Hi'] };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Sample prompt 1 is too short');
  });

  it('should fail with no capabilities', () => {
    const invalidProfile = { ...validProfile, capabilities: [] };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('At least one capability is required');
  });

  it('should fail with no restrictions', () => {
    const invalidProfile = { ...validProfile, restrictions: [] };
    const result = PersonalityProfileValidator.validate(invalidProfile);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('At least one restriction is required');
  });
});