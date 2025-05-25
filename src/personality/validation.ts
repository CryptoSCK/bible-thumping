/**
 * Validation logic for personality profiles
 */
export interface PersonalityProfile {
  id: string;
  name: string;
  tone: string;
  traits: string[];
  samplePrompts: string[];
  backgroundContext: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class PersonalityProfileValidator {
  /**
   * Validate a personality profile
   * @param profile The profile to validate
   * @returns Validation result with errors if any
   */
  static validateProfile(profile: PersonalityProfile): ValidationResult {
    const errors: string[] = [];

    // ID validation
    if (!profile.id || profile.id.trim().length === 0) {
      errors.push('Profile ID is required and cannot be empty');
    }

    // Name validation
    if (!profile.name || profile.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Tone validation
    if (!profile.tone || profile.tone.trim().length === 0) {
      errors.push('Tone is required');
    }

    // Traits validation
    if (!profile.traits || profile.traits.length === 0) {
      errors.push('At least one trait must be specified');
    }

    // Sample prompts validation
    if (!profile.samplePrompts || profile.samplePrompts.length < 3) {
      errors.push('At least 3 sample prompts are required');
    }

    // Background context validation
    if (!profile.backgroundContext || profile.backgroundContext.trim().length < 10) {
      errors.push('Background context must be at least 10 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize profile input by trimming whitespace
   * @param profile Raw profile input
   * @returns Sanitized profile
   */
  static sanitizeProfile(profile: PersonalityProfile): PersonalityProfile {
    return {
      id: profile.id.trim(),
      name: profile.name.trim(),
      tone: profile.tone.trim(),
      traits: profile.traits.map(trait => trait.trim()).filter(trait => trait !== ''),
      samplePrompts: profile.samplePrompts.map(prompt => prompt.trim()).filter(prompt => prompt !== ''),
      backgroundContext: profile.backgroundContext.trim()
    };
  }
}