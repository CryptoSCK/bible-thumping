import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryPersonalityProfileRepository } from '../src/personality/storage';
import { PersonalityProfile } from '../src/personality/types';

describe('Personality Profile Storage', () => {
  let repository: InMemoryPersonalityProfileRepository;
  let sampleProfile: Omit<PersonalityProfile, 'id' | 'version'>;

  beforeEach(() => {
    repository = new InMemoryPersonalityProfileRepository();
    sampleProfile = {
      name: 'Test Disciple',
      description: 'A test personality profile',
      tone: 'Friendly and wise',
      traits: ['compassionate', 'patient'],
      samplePrompts: ['Tell me a parable', 'Explain your teachings']
    };
  });

  it('should create a new personality profile', async () => {
    const createdProfile = await repository.create(sampleProfile);
    
    expect(createdProfile).toHaveProperty('id');
    expect(createdProfile).toHaveProperty('version', 1);
    expect(createdProfile.name).toBe(sampleProfile.name);
  });

  it('should retrieve a created profile', async () => {
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

  it('should delete a profile', async () => {
    const createdProfile = await repository.create(sampleProfile);
    await repository.delete(createdProfile.id);

    const retrievedProfile = await repository.get(createdProfile.id);
    expect(retrievedProfile).toBeNull();
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
});