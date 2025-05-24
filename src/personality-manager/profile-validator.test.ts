import { describe, it, expect } from 'vitest';
import { PersonalityProfileValidator, PersonalityProfile } from './profile-validator';

describe('PersonalityProfileValidator', () => {
  const validProfile: PersonalityProfile = {
    name: 'Jesus',
    tone: 'Compassionate',
    description: 'The central figure of Christianity, known for love and redemption',
    samplePrompts: ['Tell me about forgiveness', 'What is the meaning of love?'],
    traits: {
      kindness: 10,
      wisdom: 9
    }
  };

  describe('validate', () => {
    it('should validate a complete profile', () => {
      const result = PersonalityProfileValidator.validate(validProfile);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for short name', () => {
      const profile = { ...validProfile, name: 'J' };
      const result = PersonalityProfileValidator.validate(profile);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Name must be at least 2 characters long');
    });

    it('should fail validation for missing sample prompts', () => {
      const profile = { ...validProfile, samplePrompts: [] };
      const result = PersonalityProfileValidator.validate(profile);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('At least one sample prompt is required');
    });

    it('should fail validation for short sample prompts', () => {
      const profile = { ...validProfile, samplePrompts: ['Hi'] };
      const result = PersonalityProfileValidator.validate(profile);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Sample prompt #1 must be at least 5 characters long');
    });

    it('should fail validation for missing traits', () => {
      const profile = { ...validProfile, traits: {} };
      const result = PersonalityProfileValidator.validate(profile);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('At least one trait is required');
    });
  });

  describe('sanitize', () => {
    it('should trim whitespace from profile fields', () => {
      const dirtyProfile: PersonalityProfile = {
        name: '  Jesus  ',
        tone: ' Compassionate ',
        description: '  The central figure of Christianity  ',
        samplePrompts: ['  Tell me about forgiveness  ', '  '],
        traits: {
          ' kindness ': 10,
          ' wisdom ': 9
        }
      };

      const sanitized = PersonalityProfileValidator.sanitize(dirtyProfile);
      expect(sanitized).toEqual({
        name: 'Jesus',
        tone: 'Compassionate',
        description: 'The central figure of Christianity',
        samplePrompts: ['Tell me about forgiveness'],
        traits: {
          kindness: 10,
          wisdom: 9
        }
      });
    });
  });
});