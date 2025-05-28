import { describe, it, expect, beforeEach } from 'vitest';
import { PersonalityStorage } from './personality-storage';
import { PersonalityProfile } from './personality-profile';

describe('PersonalityStorage', () => {
  let storage: PersonalityStorage;
  let validProfile: PersonalityProfile;

  beforeEach(() => {
    storage = new PersonalityStorage();
    validProfile = {
      id: 'test-profile',
      name: 'Test Profile',
      description: 'A test personality profile',
      tone: 'friendly',
      samplePrompts: ['Hello!'],
      version: 1
    };
  });

  it('should store a valid profile', () => {
    const storedId = storage.storeProfile(validProfile);
    expect(storedId).toBe('test-profile');
    expect(storage.getProfile('test-profile')).toEqual(validProfile);
  });

  it('should list stored profiles', () => {
    storage.storeProfile(validProfile);
    const profileIds = storage.listProfiles();
    expect(profileIds).toContain('test-profile');
  });

  it('should delete a profile', () => {
    storage.storeProfile(validProfile);
    const deleted = storage.deleteProfile('test-profile');
    expect(deleted).toBe(true);
    expect(storage.getProfile('test-profile')).toBeUndefined();
  });

  it('should throw error when storing an invalid profile', () => {
    const invalidProfile = {...validProfile, id: '', name: ''};
    expect(() => storage.storeProfile(invalidProfile)).toThrowError('Invalid profile');
  });

  it('should increment version when storing profile with existing ID', () => {
    storage.storeProfile(validProfile);
    const updatedProfile = {...validProfile, description: 'Updated description'};
    storage.storeProfile(updatedProfile);
    
    const storedProfile = storage.getProfile('test-profile');
    expect(storedProfile?.version).toBe(2);
  });
});