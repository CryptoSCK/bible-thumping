export interface PersonalityProfile {
  id: string;
  name: string;
  description: string;
  tone: string;
  traits: string[];
  samplePrompts: string[];
  version: number;
}

export interface PersonalityProfileRepository {
  create(profile: PersonalityProfile): Promise<PersonalityProfile>;
  get(id: string): Promise<PersonalityProfile | null>;
  update(profile: PersonalityProfile): Promise<PersonalityProfile>;
  delete(id: string): Promise<void>;
  list(): Promise<PersonalityProfile[]>;
}