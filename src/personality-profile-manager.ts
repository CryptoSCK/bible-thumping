import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

// Personality Profile Schema
const PersonalityProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Name must not be empty" }),
  description: z.string().optional(),
  tone: z.enum(['serious', 'playful', 'sarcastic', 'empathetic']),
  traits: z.array(z.string()).optional(),
  knowledgeDomains: z.array(z.string()).optional(),
  promptTemplates: z.record(z.string(), z.string()).optional(),
  version: z.number().int().positive().default(1),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

// Type for Personality Profile
export type PersonalityProfile = z.infer<typeof PersonalityProfileSchema>;

export class PersonalityProfileManager {
  private profiles: Map<string, PersonalityProfile> = new Map();
  private storageDirectory: string;

  constructor(storageDir: string = 'profiles') {
    this.storageDirectory = path.resolve(process.cwd(), storageDir);
  }

  // Ensure storage directory exists
  private async ensureStorageDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.storageDirectory, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create storage directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Generate file path for a profile
  private getProfileFilePath(id: string): string {
    return path.join(this.storageDirectory, `${id}.json`);
  }

  // Save a single profile to a JSON file
  async saveProfile(profile: PersonalityProfile): Promise<void> {
    await this.ensureStorageDirectory();
    
    try {
      // Validate the profile before saving
      const validatedProfile = PersonalityProfileSchema.parse(profile);
      
      const filePath = this.getProfileFilePath(validatedProfile.id);
      const profileJson = JSON.stringify(validatedProfile, (key, value) => 
        value instanceof Date ? value.toISOString() : value, 
        2
      );
      
      await fs.writeFile(filePath, profileJson, 'utf8');
    } catch (error) {
      throw new Error(`Failed to save profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Load a single profile from a JSON file
  async loadProfile(id: string): Promise<PersonalityProfile> {
    try {
      const filePath = this.getProfileFilePath(id);
      const fileContents = await fs.readFile(filePath, 'utf8');
      
      // Parse the JSON and convert date strings back to Date objects
      const parsedData = JSON.parse(fileContents, (key, value) => {
        if (key === 'createdAt' || key === 'updatedAt') {
          return new Date(value);
        }
        return value;
      });

      // Validate the loaded profile
      return PersonalityProfileSchema.parse(parsedData);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        throw new Error(`Profile with ID ${id} not found`);
      }
      throw new Error(`Failed to load profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // List all profile files
  async listProfiles(): Promise<PersonalityProfile[]> {
    await this.ensureStorageDirectory();

    try {
      const files = await fs.readdir(this.storageDirectory);
      const profileFiles = files.filter(file => file.endsWith('.json'));
      
      const profiles = await Promise.all(
        profileFiles.map(async (file) => {
          const id = path.basename(file, '.json');
          return this.loadProfile(id);
        })
      );

      return profiles;
    } catch (error) {
      throw new Error(`Failed to list profiles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Create a new personality profile
  async createProfile(profileData: Omit<PersonalityProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<PersonalityProfile> {
    const newProfile: PersonalityProfile = {
      ...profileData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Validate the profile
    const validatedProfile = PersonalityProfileSchema.parse(newProfile);
    
    // Save the profile to file
    await this.saveProfile(validatedProfile);
    
    return validatedProfile;
  }

  // Update an existing profile
  async updateProfile(id: string, updateData: Partial<Omit<PersonalityProfile, 'id' | 'createdAt'>>): Promise<PersonalityProfile> {
    // Load existing profile
    const existingProfile = await this.loadProfile(id);
    
    const updatedProfile = {
      ...existingProfile,
      ...updateData,
      updatedAt: new Date()
    };

    // Validate the updated profile
    const validatedProfile = PersonalityProfileSchema.parse(updatedProfile);
    
    // Save the updated profile
    await this.saveProfile(validatedProfile);
    
    return validatedProfile;
  }

  // Delete a profile
  async deleteProfile(id: string): Promise<void> {
    try {
      const filePath = this.getProfileFilePath(id);
      await fs.unlink(filePath);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        throw new Error(`Profile with ID ${id} not found`);
      }
      throw new Error(`Failed to delete profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Find profiles by name or traits
  async findProfiles(criteria: { name?: string, traits?: string[] }): Promise<PersonalityProfile[]> {
    const allProfiles = await this.listProfiles();
    
    return allProfiles.filter(profile => {
      const nameMatch = !criteria.name || profile.name.toLowerCase().includes(criteria.name.toLowerCase());
      const traitsMatch = !criteria.traits || 
        criteria.traits.every(trait => 
          profile.traits?.some(profileTrait => 
            profileTrait.toLowerCase().includes(trait.toLowerCase())
          )
        );
      
      return nameMatch && traitsMatch;
    });
  }
}