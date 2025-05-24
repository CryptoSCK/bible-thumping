// Personality Profile Validation Logic

export interface PersonalityProfile {
  id: string;
  name: string;
  tone: string;
  description: string;
  samplePrompts: string[];
  capabilities: string[];
  restrictions: string[];
}

export class PersonalityProfileValidator {
  /**
   * Validate a personality profile
   * @param profile The personality profile to validate
   * @returns Validation result with errors or true
   */
  static validate(profile: PersonalityProfile): ValidationResult {
    const errors: string[] = [];

    // Validate ID
    if (!profile.id || profile.id.trim().length === 0) {
      errors.push('Profile ID is required');
    }

    // Validate Name
    if (!profile.name || profile.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Validate Tone
    const validTones = ['formal', 'casual', 'professional', 'friendly', 'academic'];
    if (!profile.tone || !validTones.includes(profile.tone.toLowerCase())) {
      errors.push(`Tone must be one of: ${validTones.join(', ')}`);
    }

    // Validate Description
    if (!profile.description || profile.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long');
    }

    // Validate Sample Prompts
    if (!profile.samplePrompts || profile.samplePrompts.length < 1) {
      errors.push('At least one sample prompt is required');
    } else {
      profile.samplePrompts.forEach((prompt, index) => {
        if (prompt.trim().length < 5) {
          errors.push(`Sample prompt ${index + 1} is too short`);
        }
      });
    }

    // Validate Capabilities
    if (!profile.capabilities || profile.capabilities.length === 0) {
      errors.push('At least one capability is required');
    }

    // Validate Restrictions
    if (!profile.restrictions || profile.restrictions.length === 0) {
      errors.push('At least one restriction is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}