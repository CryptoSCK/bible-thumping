/**
 * Personality Profile Validation Module
 * Validates personality profile configurations for the multi-agent chatbot platform
 */

export interface PersonalityProfile {
  id?: string;
  name: string;
  tone: string;
  description: string;
  promptTemplates: string[];
  traits: {
    [key: string]: string | number;
  };
}

export class PersonalityProfileValidator {
  /**
   * Validate a personality profile
   * @param profile The personality profile to validate
   * @returns Validation result with errors or true
   */
  static validate(profile: PersonalityProfile): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Name validation
    if (!profile.name || profile.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Tone validation
    if (!profile.tone || profile.tone.trim().length < 3) {
      errors.push('Tone must be at least 3 characters long');
    }

    // Description validation
    if (!profile.description || profile.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long');
    }

    // Prompt templates validation
    if (!profile.promptTemplates || profile.promptTemplates.length === 0) {
      errors.push('At least one prompt template is required');
    } else {
      profile.promptTemplates.forEach((template, index) => {
        if (!template || template.trim().length < 5) {
          errors.push(`Prompt template at index ${index} is too short`);
        }
      });
    }

    // Traits validation
    if (!profile.traits || Object.keys(profile.traits).length === 0) {
      errors.push('At least one trait is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}