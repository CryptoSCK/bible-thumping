// Personality Profile Validation Logic

// Define the shape of a valid Personality Profile
export interface PersonalityProfile {
  id: string;
  name: string;
  description: string;
  tone: string;
  samplePrompts: string[];
  version: string;
}

// Validation error types
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Personality Profile Validator
export class PersonalityProfileValidator {
  /**
   * Validate a personality profile
   * @param profile - The personality profile to validate
   * @throws {ValidationError} If the profile is invalid
   */
  static validate(profile: PersonalityProfile): void {
    // Check for required fields
    if (!profile.id) {
      throw new ValidationError('Profile must have an ID');
    }

    if (!profile.name || profile.name.trim().length < 2) {
      throw new ValidationError('Profile name must be at least 2 characters long');
    }

    if (!profile.description || profile.description.trim().length < 10) {
      throw new ValidationError('Profile description must be at least 10 characters long');
    }

    if (!profile.tone) {
      throw new ValidationError('Profile must have a tone defined');
    }

    // Validate sample prompts
    if (!profile.samplePrompts || profile.samplePrompts.length === 0) {
      throw new ValidationError('Profile must have at least one sample prompt');
    }

    profile.samplePrompts.forEach((prompt, index) => {
      if (!prompt || prompt.trim().length < 5) {
        throw new ValidationError(`Sample prompt at index ${index} must be at least 5 characters long`);
      }
    });

    // Validate version format (simple semantic versioning check)
    if (!profile.version || !/^\d+\.\d+\.\d+$/.test(profile.version)) {
      throw new ValidationError('Profile version must be in semantic version format (e.g., 1.0.0)');
    }
  }

  /**
   * Check if a profile is valid
   * @param profile - The personality profile to check
   * @returns boolean indicating if the profile is valid
   */
  static isValid(profile: PersonalityProfile): boolean {
    try {
      this.validate(profile);
      return true;
    } catch {
      return false;
    }
  }
}