/**
 * Represents the structure of a Personality Profile
 */
export interface PersonalityProfile {
  id: string;
  name: string;
  tone: string;
  description: string;
  traits: string[];
  samplePrompts: string[];
}

/**
 * Validates a Personality Profile
 * @param profile The personality profile to validate
 * @returns An array of validation errors or an empty array if valid
 */
export function validatePersonalityProfile(profile: PersonalityProfile): string[] {
  const errors: string[] = [];

  // Validate ID
  if (!profile.id || profile.id.trim() === '') {
    errors.push('ID is required');
  }

  // Validate Name
  if (!profile.name || profile.name.trim() === '') {
    errors.push('Name is required');
  } else if (profile.name.length < 2 || profile.name.length > 50) {
    errors.push('Name must be between 2 and 50 characters');
  }

  // Validate Tone
  const validTones = ['serious', 'playful', 'sarcastic', 'empathetic', 'analytical'];
  if (!profile.tone || !validTones.includes(profile.tone.toLowerCase())) {
    errors.push(`Tone must be one of: ${validTones.join(', ')}`);
  }

  // Validate Description
  if (!profile.description || profile.description.trim() === '') {
    errors.push('Description is required');
  } else if (profile.description.length < 10 || profile.description.length > 500) {
    errors.push('Description must be between 10 and 500 characters');
  }

  // Validate Traits
  if (!profile.traits || !Array.isArray(profile.traits) || profile.traits.length === 0) {
    errors.push('At least one trait is required');
  } else if (profile.traits.length > 10) {
    errors.push('Maximum of 10 traits allowed');
  }

  // Validate Sample Prompts
  if (!profile.samplePrompts || !Array.isArray(profile.samplePrompts) || profile.samplePrompts.length === 0) {
    errors.push('At least one sample prompt is required');
  } else if (profile.samplePrompts.length > 5) {
    errors.push('Maximum of 5 sample prompts allowed');
  }

  return errors;
}

/**
 * Checks if a Personality Profile is valid
 * @param profile The personality profile to check
 * @returns Boolean indicating if the profile is valid
 */
export function isValidPersonalityProfile(profile: PersonalityProfile): boolean {
  return validatePersonalityProfile(profile).length === 0;
}