import { PersonalityProfile, PersonalityProfileRepository } from './types';
import { v4 as uuidv4 } from 'uuid';

export class InMemoryPersonalityProfileRepository implements PersonalityProfileRepository {
  private profiles: Map<string, PersonalityProfile> = new Map();

  async create(profile: Omit<PersonalityProfile, 'id' | 'version'>): Promise<PersonalityProfile> {
    const completeProfile: PersonalityProfile = {
      id: uuidv4(),
      version: 1,
      ...profile
    };

    if (!this.validateProfile(completeProfile)) {
      throw new Error('Invalid personality profile');
    }

    this.profiles.set(completeProfile.id, completeProfile);
    return completeProfile;
  }

  async get(id: string): Promise<PersonalityProfile | null> {
    return this.profiles.get(id) || null;
  }

  async update(profile: PersonalityProfile): Promise<PersonalityProfile> {
    if (!this.validateProfile(profile)) {
      throw new Error('Invalid personality profile');
    }

    const existingProfile = await this.get(profile.id);
    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    // Increment version on update
    const updatedProfile = { ...profile, version: existingProfile.version + 1 };
    this.profiles.set(profile.id, updatedProfile);
    return updatedProfile;
  }

  async delete(id: string): Promise<void> {
    if (!this.profiles.has(id)) {
      throw new Error('Profile not found');
    }
    this.profiles.delete(id);
  }

  async list(): Promise<PersonalityProfile[]> {
    return Array.from(this.profiles.values());
  }

  private validateProfile(profile: PersonalityProfile): boolean {
    // Basic validation rules
    return !!(
      profile.name &&
      profile.description &&
      profile.tone &&
      profile.traits.length > 0 &&
      profile.samplePrompts.length > 0
    );
  }
}