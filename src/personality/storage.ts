import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PersonalityProfile, PersonalityProfileRepository } from './types';

const PROFILES_DIR = path.join(process.cwd(), 'personality-profiles');

export class FilePersonalityProfileRepository implements PersonalityProfileRepository {
  private async ensureDirectoryExists(): Promise<void> {
    try {
      await fs.mkdir(PROFILES_DIR, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create profiles directory: ${error instanceof Error ? error.message : error}`);
    }
  }

  private getProfilePath(id: string): string {
    return path.join(PROFILES_DIR, `${id}.json`);
  }

  private validateProfile(profile: PersonalityProfile): boolean {
    // Basic validation rules
    return !!(
      profile.id &&
      profile.name &&
      profile.description &&
      profile.tone &&
      profile.traits.length > 0 &&
      profile.samplePrompts.length > 0
    );
  }

  async create(profileData: Omit<PersonalityProfile, 'id' | 'version'>): Promise<PersonalityProfile> {
    await this.ensureDirectoryExists();

    const profile: PersonalityProfile = {
      id: uuidv4(),
      version: 1,
      ...profileData
    };

    if (!this.validateProfile(profile)) {
      throw new Error('Invalid personality profile');
    }

    try {
      const profilePath = this.getProfilePath(profile.id);
      await fs.writeFile(profilePath, JSON.stringify(profile, null, 2), 'utf-8');
      return profile;
    } catch (error) {
      throw new Error(`Failed to save profile: ${error instanceof Error ? error.message : error}`);
    }
  }

  async get(id: string): Promise<PersonalityProfile | null> {
    try {
      const profilePath = this.getProfilePath(id);
      const profileData = await fs.readFile(profilePath, 'utf-8');
      const profile = JSON.parse(profileData) as PersonalityProfile;

      if (!this.validateProfile(profile)) {
        throw new Error('Loaded profile failed validation');
      }

      return profile;
    } catch (error) {
      if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw new Error(`Failed to read profile: ${error instanceof Error ? error.message : error}`);
    }
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
    const updatedProfile = { 
      ...profile, 
      version: (existingProfile.version || 0) + 1 
    };

    try {
      const profilePath = this.getProfilePath(profile.id);
      await fs.writeFile(profilePath, JSON.stringify(updatedProfile, null, 2), 'utf-8');
      return updatedProfile;
    } catch (error) {
      throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : error}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const profilePath = this.getProfilePath(id);
      await fs.unlink(profilePath);
    } catch (error) {
      if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error('Profile not found');
      }
      throw new Error(`Failed to delete profile: ${error instanceof Error ? error.message : error}`);
    }
  }

  async list(): Promise<PersonalityProfile[]> {
    await this.ensureDirectoryExists();

    try {
      const files = await fs.readdir(PROFILES_DIR);
      const profilePromises = files
        .filter(file => file.endsWith('.json'))
        .map(file => this.get(path.basename(file, '.json')));

      const profiles = await Promise.all(profilePromises);
      return profiles.filter((profile): profile is PersonalityProfile => profile !== null);
    } catch (error) {
      throw new Error(`Failed to list profiles: ${error instanceof Error ? error.message : error}`);
    }
  }
}