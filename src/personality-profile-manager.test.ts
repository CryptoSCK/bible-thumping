import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PersonalityProfileManager } from './personality-profile-manager';
import fs from 'fs/promises';
import path from 'path';

describe('PersonalityProfileManager', () => {
  const TEST_PROFILES_DIR = path.resolve(process.cwd(), 'test-profiles');
  let profileManager: PersonalityProfileManager;

  beforeEach(() => {
    profileManager = new PersonalityProfileManager(TEST_PROFILES_DIR);
  });

  afterEach(async () => {
    // Clean up test profiles directory after each test
    try {
      await fs.rm(TEST_PROFILES_DIR, { recursive: true, force: true });
    } catch {}
  });

  it('should create a personality profile and save it to a file', async () => {
    const profile = await profileManager.createProfile({
      name: 'Test Disciple',
      tone: 'serious',
      traits: ['wise', 'thoughtful']
    });

    expect(profile.name).toBe('Test Disciple');
    expect(profile.tone).toBe('serious');
    expect(profile.traits).toEqual(['wise', 'thoughtful']);
    expect(profile.id).toBeDefined();

    // Verify file was created
    const filePath = path.join(TEST_PROFILES_DIR, `${profile.id}.json`);
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    expect(fileExists).toBe(true);
  });

  it('should throw an error when creating an invalid profile', async () => {
    await expect(
      profileManager.createProfile({
        // @ts-ignore - intentionally passing invalid data
        name: '',
        tone: 'serious'
      })
    ).rejects.toThrow();
  });

  it('should load a previously saved profile', async () => {
    const originalProfile = await profileManager.createProfile({
      name: 'Retrievable Disciple',
      tone: 'playful'
    });

    const retrievedProfile = await profileManager.loadProfile(originalProfile.id);
    expect(retrievedProfile).toEqual(originalProfile);
  });

  it('should throw an error when loading a non-existent profile', async () => {
    await expect(
      profileManager.loadProfile('non-existent-id')
    ).rejects.toThrow('Profile with ID non-existent-id not found');
  });

  it('should update an existing profile', async () => {
    const profile = await profileManager.createProfile({
      name: 'Original Disciple',
      tone: 'serious'
    });

    const updatedProfile = await profileManager.updateProfile(profile.id, {
      name: 'Updated Disciple',
      traits: ['wise']
    });

    expect(updatedProfile.name).toBe('Updated Disciple');
    expect(updatedProfile.traits).toEqual(['wise']);
    expect(updatedProfile.updatedAt.getTime()).toBeGreaterThan(profile.createdAt.getTime());
  });

  it('should delete a profile', async () => {
    const profile = await profileManager.createProfile({
      name: 'Deletable Disciple',
      tone: 'sarcastic'
    });

    await profileManager.deleteProfile(profile.id);

    await expect(
      profileManager.loadProfile(profile.id)
    ).rejects.toThrow(`Profile with ID ${profile.id} not found`);
  });

  it('should list all profiles', async () => {
    await profileManager.createProfile({
      name: 'Disciple 1',
      tone: 'serious'
    });
    await profileManager.createProfile({
      name: 'Disciple 2',
      tone: 'playful'
    });

    const profiles = await profileManager.listProfiles();
    expect(profiles.length).toBe(2);
  });

  it('should find profiles by name', async () => {
    await profileManager.createProfile({
      name: 'John the Wise',
      tone: 'serious',
      traits: ['thoughtful']
    });
    await profileManager.createProfile({
      name: 'Peter the Bold',
      tone: 'playful',
      traits: ['energetic']
    });

    const wisePeople = await profileManager.findProfiles({ name: 'john' });
    expect(wisePeople.length).toBe(1);
    expect(wisePeople[0].name).toBe('John the Wise');
  });

  it('should find profiles by traits', async () => {
    await profileManager.createProfile({
      name: 'Wise Disciple',
      tone: 'serious',
      traits: ['wise', 'thoughtful']
    });
    await profileManager.createProfile({
      name: 'Bold Disciple',
      tone: 'playful',
      traits: ['energetic', 'loud']
    });

    const wisePeople = await profileManager.findProfiles({ traits: ['wise'] });
    expect(wisePeople.length).toBe(1);
    expect(wisePeople[0].name).toBe('Wise Disciple');
  });
});