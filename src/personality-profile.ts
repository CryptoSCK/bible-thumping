/**
 * Represents a Personality Profile with core attributes and validation
 */
export interface PersonalityProfile {
  id: string;
  name: string;
  description: string;
  tone: string;
  samplePrompts: string[];
  version: number;
}

/**
 * Validates a personality profile
 * @param profile - The profile to validate
 * @returns Validation result with boolean and optional error messages
 */
export function validatePersonalityProfile(profile: PersonalityProfile): { 
  isValid: boolean; 
  errors: string[] 
} {
  const errors: string[] = [];

  if (!profile.id || profile.id.trim() === '') {
    errors.push('Profile ID is required');
  }

  if (!profile.name || profile.name.trim() === '') {
    errors.push('Profile name is required');
  }

  if (profile.samplePrompts.length === 0) {
    errors.push('At least one sample prompt is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}