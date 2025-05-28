import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { FilePersonalityProfileRepository } from '../src/personality/storage';
import { PersonalityProfile } from '../src/personality/types';

const PROFILES_DIR = path.join(process.cwd(), 'personality-profiles');

describe('File-Based Personality Profile Storage', () => {
  let repository: FilePersonalityProfileRepository;
  let sampleProfile: Omit<PersonalityProfile, 'id' | 'version'>;

  beforeEach(() => {
    repository = new FilePersonalityProfileRepository();
    sampleProfile = {
      name: 'Test Disciple',
      description: 'A test personality profile',
      tone: 'Friendly and wise',
      traits: ['compassionate', 'patient'],
      samplePrompts: ['Tell me a parable', 'Explain your teachings']
    };
  });

  afterEach(async () => {
    // Clean up profile files after each test
    try {
      const files = await fs.readdir(PROFILES_DIR);
      for (const file of files) {
        await fs.unlink(path.join(PROFILES_DIR, file));
      }
      await fs.rmdir(PROFILES_DIR);
    } catch {
      // Ignore errors if directory doesn't exist
    }
  });

  it('should create a new personality profile and save to file', async () => {
    const createdProfile = await repository.create(sampleProfile);
    
    expect(createdProfile).toHaveProperty('id');
    expect(createdProfile).toHaveProperty('version', 1);
    expect(createdProfile.name).toBe(sampleProfile.name);

    // Verify file was created
    const profilePath = path.join(PROFILES_DIR, `${createdProfile.id}.json`);
    const fileExists = await fs.access(profilePath).then(() => true).catch(() => false);
    expect(fileExists).toBe(true);
  });

  it('should retrieve a profile from file', async () => {
    const createdProfile = await repository.create(sampleProfile);
    const retrievedProfile = await repository.get(createdProfile.id);

    expect(retrievedProfile).toEqual(createdProfile);
  });

  it('should update an existing profile', async () => {
    const createdProfile = await repository.create(sampleProfile);
    const updatedProfile = await repository.update({
      ...createdProfile,
      name: 'Updated Disciple'
    });

    expect(updatedProfile.name).toBe('Updated Disciple');
    expect(updatedProfile.version).toBe(2);
  });

  it('should delete a profile file', async () => {
    const createdProfile = await repository.create(sampleProfile);
    await repository.delete(createdProfile.id);

    const retrievedProfile = await repository.get(createdProfile.id);
    expect(retrievedProfile).toBeNull();

    // Verify file was deleted
    const profilePath = path.join(PROFILES_DIR, `${createdProfile.id}.json`);
    const fileExists = await fs.access(profilePath).then(() => true).catch(() => false);
    expect(fileExists).toBe(false);
  });

  it('should list all profiles', async () => {
    await repository.create(sampleProfile);
    await repository.create({
      ...sampleProfile,
      name: 'Another Disciple'
    });

    const profiles = await repository.list();
    expect(profiles.length).toBe(2);
  });

  it('should throw error on invalid profile creation', async () => {
    const invalidProfile = { ...sampleProfile, name: '' };
    
    await expect(repository.create(invalidProfile as any)).rejects.toThrow('Invalid personality profile');
  });

  it('should handle reading non-existent profile', async () => {
    const retrievedProfile = await repository.get('non-existent-id');
    expect(retrievedProfile).toBeNull();
  });

  it('should throw error when updating non-existent profile', async () => {
    const nonExistentProfile = {
      id: 'non-existent-id',
      ...sampleProfile,
      version: 1
    };

    await expect(repository.update(nonExistentProfile)).rejects.toThrow('Profile not found');
  });

  it('should throw error when deleting non-existent profile', async () => {
    await expect(repository.delete('non-existent-id')).rejects.toThrow('Profile not found');
  });
});