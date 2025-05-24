/**
 * Personality Profile Validation Module
 * 
 * Validates the structure and content of personality profiles 
 * to ensure data integrity and consistency.
 */

export interface PersonalityProfile {
  id: string;
  name: string;
  tone: string;
  description: string;
  samplePrompts: string[];
  traits: {
    [key: string]: string | number;
  };
}

export class PersonalityProfileValidator {
  /**
   * Validate a personality profile
   * @param profile - The personality profile to validate
   * @returns An array of validation errors, or an empty array if valid
   */
  static validate(profile: PersonalityProfile): string[] {
    const errors: string[] = [];

    // Validate ID
    if (!profile.id || profile.id.trim().length === 0) {
      errors.push('Profile ID is required and cannot be empty');
    }

    // Validate Name
    if (!profile.name || profile.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Validate Tone
    if (!profile.tone || profile.tone.trim().length === 0) {
      errors.push('Tone is required');
    }

    // Validate Description
    if (!profile.description || profile.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long');
    }

    // Validate Sample Prompts
    if (!profile.samplePrompts || profile.samplePrompts.length === 0) {
      errors.push('At least one sample prompt is required');
    } else {
      profile.samplePrompts.forEach((prompt, index) => {
        if (!prompt || prompt.trim().length < 5) {
          errors.push(`Sample prompt at index ${index} is too short`);
        }
      });
    }

    // Validate Traits
    if (!profile.traits || Object.keys(profile.traits).length === 0) {
      errors.push('At least one trait is required');
    }

    return errors;
  }

  /**
   * Check if a profile is valid
   * @param profile - The personality profile to check
   * @returns Boolean indicating if the profile is valid
   */
  static isValid(profile: PersonalityProfile): boolean {
    return this.validate(profile).length === 0;
  }
}