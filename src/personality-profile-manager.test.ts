import { describe, it, expect, beforeEach } from 'vitest';
import { PersonalityProfileManager } from './personality-profile-manager';

describe('PersonalityProfileManager', () => {
  let profileManager: PersonalityProfileManager;

  beforeEach(() => {
    profileManager = new PersonalityProfileManager();
  });

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  it('should create a personality profile', () => {
    const profile = profileManager.createProfile({
      name: 'Test Disciple',
      tone: 'serious',
      traits: ['wise', 'thoughtful']
    });

    expect(profile.name).toBe('Test Disciple');
    expect(profile.tone).toBe('serious');
    expect(profile.traits).toEqual(['wise', 'thoughtful']);
    expect(profile.id).toBeDefined();
  });

  it('should throw an error when creating an invalid profile', () => {
    expect(() => 
      profileManager.createProfile({
        // @ts-ignore - intentionally passing invalid data
        name: '',
        tone: 'serious'
      })
    ).toThrow();
  });

  it('should retrieve a profile by ID', () => {
    const profile = profileManager.createProfile({
      name: 'Retrievable Disciple',
      tone: 'playful'
    });

    const retrievedProfile = profileManager.getProfile(profile.id);
    expect(retrievedProfile).toEqual(profile);
  });

  it('should throw an error when retrieving a non-existent profile', () => {
    expect(() => profileManager.getProfile('non-existent-id'))
      .toThrow('Profile with ID non-existent-id not found');
  });

  it('should update an existing profile', async () => {
    const profile = profileManager.createProfile({
      name: 'Original Disciple',
      tone: 'serious'
    });

    // Wait a bit to ensure time difference
    await wait(10);

    const updatedProfile = profileManager.updateProfile(profile.id, {
      name: 'Updated Disciple',
      traits: ['wise']
    });

    expect(updatedProfile.name).toBe('Updated Disciple');
    expect(updatedProfile.traits).toEqual(['wise']);
    expect(updatedProfile.updatedAt.getTime()).toBeGreaterThan(profile.createdAt.getTime());
  });

  it('should delete a profile', () => {
    const profile = profileManager.createProfile({
      name: 'Deletable Disciple',
      tone: 'sarcastic'
    });

    profileManager.deleteProfile(profile.id);

    expect(() => profileManager.getProfile(profile.id))
      .toThrow(`Profile with ID ${profile.id} not found`);
  });

  it('should list all profiles', () => {
    profileManager.createProfile({
      name: 'Disciple 1',
      tone: 'serious'
    });
    profileManager.createProfile({
      name: 'Disciple 2',
      tone: 'playful'
    });

    const profiles = profileManager.listProfiles();
    expect(profiles.length).toBe(2);
  });

  it('should find profiles by name', () => {
    profileManager.createProfile({
      name: 'John the Wise',
      tone: 'serious',
      traits: ['thoughtful']
    });
    profileManager.createProfile({
      name: 'Peter the Bold',
      tone: 'playful',
      traits: ['energetic']
    });

    const wisePeople = profileManager.findProfiles({ name: 'john' });
    expect(wisePeople.length).toBe(1);
    expect(wisePeople[0].name).toBe('John the Wise');
  });

  it('should find profiles by traits', () => {
    profileManager.createProfile({
      name: 'Wise Disciple',
      tone: 'serious',
      traits: ['wise', 'thoughtful']
    });
    profileManager.createProfile({
      name: 'Bold Disciple',
      tone: 'playful',
      traits: ['energetic', 'loud']
    });

    const wisePeople = profileManager.findProfiles({ traits: ['wise'] });
    expect(wisePeople.length).toBe(1);
    expect(wisePeople[0].name).toBe('Wise Disciple');
  });
});