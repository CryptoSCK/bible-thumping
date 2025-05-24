/**
 * Personality Profile Validation Logic
 * Ensures integrity and consistency of personality profile data
 */
export interface PersonalityProfile {
  id?: string;
  name: string;
  tone: string;
  description: string;
  samplePrompts: string[];
  constraints?: {
    maxPrompts?: number;
    minNameLength?: number;
    maxNameLength?: number;
  };
}

export class PersonalityProfileValidator {
  /**
   * Validate a personality profile
   * @param profile The personality profile to validate
   * @returns Validation result with errors if any
   */
  static validate(profile: PersonalityProfile): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check name validation
    if (!profile.name || profile.name.trim() === '') {
      errors.push('Name is required');
    }

    // Name length constraints
    const minNameLength = profile.constraints?.minNameLength ?? 2;
    const maxNameLength = profile.constraints?.maxNameLength ?? 50;
    if (profile.name.length < minNameLength) {
      errors.push(`Name must be at least ${minNameLength} characters long`);
    }
    if (profile.name.length > maxNameLength) {
      errors.push(`Name must not exceed ${maxNameLength} characters`);
    }

    // Tone validation
    if (!profile.tone || profile.tone.trim() === '') {
      errors.push('Tone is required');
    }

    // Description validation
    if (!profile.description || profile.description.trim() === '') {
      errors.push('Description is required');
    }

    // Sample prompts validation
    if (!profile.samplePrompts || profile.samplePrompts.length === 0) {
      errors.push('At least one sample prompt is required');
    }

    // Max prompts constraint
    const maxPrompts = profile.constraints?.maxPrompts ?? 10;
    if (profile.samplePrompts && profile.samplePrompts.length > maxPrompts) {
      errors.push(`Cannot exceed ${maxPrompts} sample prompts`);
    }

    // Validate individual sample prompts
    if (profile.samplePrompts) {
      profile.samplePrompts.forEach((prompt, index) => {
        if (!prompt || prompt.trim() === '') {
          errors.push(`Sample prompt at index ${index} cannot be empty`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}