import { PersonalityProfile } from './personality-profile';

/**
 * Interface for Personality Profile Storage and Retrieval
 */
export class PersonalityStorage {
  private profiles: Map<string, PersonalityProfile> = new Map();

  /**
   * Store a new personality profile
   * @param profile - Profile to store
   * @returns Stored profile ID
   * @throws Error if profile is invalid
   */
  public storeProfile(profile: PersonalityProfile): string {
    // Validate profile before storing
    const validation = this.validatePersonalityProfile(profile);
    if (!validation.isValid) {
      throw new Error(`Invalid profile: ${validation.errors.join(', ')}`);
    }

    // If profile with same ID exists, increment version
    if (this.profiles.has(profile.id)) {
      profile.version += 1;
    }

    this.profiles.set(profile.id, {...profile});
    return profile.id;
  }

  /**
   * Retrieve a personality profile by ID
   * @param id - Profile ID to retrieve
   * @returns Personality profile or undefined
   */
  public getProfile(id: string): PersonalityProfile | undefined {
    return this.profiles.get(id);
  }

  /**
   * List all stored profiles
   * @returns Array of profile IDs
   */
  public listProfiles(): string[] {
    return Array.from(this.profiles.keys());
  }

  /**
   * Delete a profile by ID
   * @param id - Profile ID to delete
   * @returns Whether deletion was successful
   */
  public deleteProfile(id: string): boolean {
    return this.profiles.delete(id);
  }

  /**
   * Validate a personality profile
   * Private method for internal validation
   */
  private validatePersonalityProfile(profile: PersonalityProfile): { 
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
}