import { z } from 'zod';

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

  // Create a new personality profile
  createProfile(profileData: Omit<PersonalityProfile, 'id' | 'createdAt' | 'updatedAt'>): PersonalityProfile {
    const newProfile: PersonalityProfile = {
      ...profileData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Validate the profile
    const validatedProfile = PersonalityProfileSchema.parse(newProfile);
    
    this.profiles.set(validatedProfile.id, validatedProfile);
    return validatedProfile;
  }

  // Retrieve a profile by ID
  getProfile(id: string): PersonalityProfile {
    const profile = this.profiles.get(id);
    if (!profile) {
      throw new Error(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  // Update an existing profile
  updateProfile(id: string, updateData: Partial<Omit<PersonalityProfile, 'id' | 'createdAt'>>): PersonalityProfile {
    const existingProfile = this.getProfile(id);
    
    const updatedProfile = {
      ...existingProfile,
      ...updateData,
      updatedAt: new Date()
    };

    // Validate the updated profile
    const validatedProfile = PersonalityProfileSchema.parse(updatedProfile);
    
    this.profiles.set(id, validatedProfile);
    return validatedProfile;
  }

  // Delete a profile
  deleteProfile(id: string): void {
    if (!this.profiles.has(id)) {
      throw new Error(`Profile with ID ${id} not found`);
    }
    this.profiles.delete(id);
  }

  // List all profiles
  listProfiles(): PersonalityProfile[] {
    return Array.from(this.profiles.values());
  }

  // Find profiles by name or traits
  findProfiles(criteria: { name?: string, traits?: string[] }): PersonalityProfile[] {
    return Array.from(this.profiles.values()).filter(profile => {
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