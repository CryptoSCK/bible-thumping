// Personality Profile Validation Logic

export interface PersonalityProfile {
  id?: string;
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
   * @param profile The profile to validate
   * @returns Validation result with errors or true
   */
  static validate(profile: PersonalityProfile): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check name
    if (!profile.name || profile.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Check tone
    if (!profile.tone || profile.tone.trim().length < 3) {
      errors.push('Tone must be at least 3 characters long');
    }

    // Check description
    if (!profile.description || profile.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long');
    }

    // Check sample prompts
    if (!profile.samplePrompts || profile.samplePrompts.length < 1) {
      errors.push('At least one sample prompt is required');
    } else {
      profile.samplePrompts.forEach((prompt, index) => {
        if (!prompt || prompt.trim().length < 5) {
          errors.push(`Sample prompt #${index + 1} must be at least 5 characters long`);
        }
      });
    }

    // Check traits
    if (!profile.traits || Object.keys(profile.traits).length === 0) {
      errors.push('At least one trait is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize a personality profile
   * @param profile The profile to sanitize
   * @returns Sanitized profile
   */
  static sanitize(profile: PersonalityProfile): PersonalityProfile {
    return {
      ...profile,
      name: profile.name?.trim(),
      tone: profile.tone?.trim(),
      description: profile.description?.trim(),
      samplePrompts: profile.samplePrompts?.map(prompt => prompt.trim()).filter(prompt => prompt.length > 0),
      traits: profile.traits ? Object.fromEntries(
        Object.entries(profile.traits).map(([key, value]) => [key.trim(), value])
      ) : {}
    };
  }
}