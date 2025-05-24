export interface PersonalityProfile {
  id: string;
  name: string;
  description: string;
  tone: string;
  traits: string[];
  samplePrompts: string[];
  version: string;
}

export class PersonalityProfileValidator {
  /**
   * Validate a personality profile
   * @param profile The personality profile to validate
   * @returns An array of validation errors or an empty array if valid
   */
  static validate(profile: PersonalityProfile): string[] {
    const errors: string[] = [];

    // ID validation
    if (!profile.id || profile.id.trim().length === 0) {
      errors.push('Profile ID is required');
    }

    // Name validation
    if (!profile.name || profile.name.trim().length < 2 || profile.name.trim().length > 50) {
      errors.push('Name must be between 2 and 50 characters');
    }

    // Description validation
    if (!profile.description || profile.description.trim().length < 10 || profile.description.trim().length > 500) {
      errors.push('Description must be between 10 and 500 characters');
    }

    // Tone validation
    const validTones = ['formal', 'casual', 'academic', 'friendly', 'professional'];
    if (!profile.tone || !validTones.includes(profile.tone.toLowerCase())) {
      errors.push(`Tone must be one of: ${validTones.join(', ')}`);
    }

    // Traits validation
    if (!profile.traits || profile.traits.length === 0 || profile.traits.length > 10) {
      errors.push('Traits must have between 1 and 10 characteristics');
    }

    // Sample prompts validation
    if (!profile.samplePrompts || profile.samplePrompts.length === 0 || profile.samplePrompts.length > 5) {
      errors.push('Must have between 1 and 5 sample prompts');
    }

    // Version validation
    const versionRegex = /^\d+\.\d+\.\d+$/;
    if (!profile.version || !versionRegex.test(profile.version)) {
      errors.push('Version must be in semantic versioning format (e.g., 1.0.0)');
    }

    return errors;
  }

  /**
   * Check if a profile is valid
   * @param profile The personality profile to check
   * @returns Boolean indicating if the profile is valid
   */
  static isValid(profile: PersonalityProfile): boolean {
    return this.validate(profile).length === 0;
  }
}