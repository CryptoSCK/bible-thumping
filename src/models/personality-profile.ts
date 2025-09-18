/**
 * Personality Profile JSON Schema
 * Defines the structure and validation rules for agent personality profiles
 */

// Enum for personality trait categories
export enum PersonalityTraitCategory {
  Emotional = 'emotional',
  Intellectual = 'intellectual',
  Social = 'social',
  Moral = 'moral'
}

// Enum for personality trait types
export enum PersonalityTraitType {
  Openness = 'openness',
  Conscientiousness = 'conscientiousness',
  Extraversion = 'extraversion',
  Agreeableness = 'agreeableness',
  Neuroticism = 'neuroticism'
}

// Interface for individual personality trait
export interface PersonalityTrait {
  type: PersonalityTraitType;
  category: PersonalityTraitCategory;
  score: number; // 0-100 range
  description?: string;
}

// Interface for dialogue prompt
export interface DialoguePrompt {
  context: string;
  examples: string[];
}

// Main Personality Profile Interface
export interface PersonalityProfile {
  id: string;
  name: string;
  version: string;
  description: string;
  traits: PersonalityTrait[];
  dialoguePrompts: DialoguePrompt[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    tags?: string[];
  };
}

// Validation function for Personality Profile
export function validatePersonalityProfile(profile: PersonalityProfile): boolean {
  // Validate basic structure
  if (!profile.id || !profile.name || !profile.traits || !profile.dialoguePrompts) {
    return false;
  }

  // Validate traits
  for (const trait of profile.traits) {
    if (trait.score < 0 || trait.score > 100) {
      return false;
    }
    if (!Object.values(PersonalityTraitType).includes(trait.type)) {
      return false;
    }
    if (!Object.values(PersonalityTraitCategory).includes(trait.category)) {
      return false;
    }
  }

  // Validate dialogue prompts
  for (const prompt of profile.dialoguePrompts) {
    if (!prompt.context || prompt.examples.length === 0) {
      return false;
    }
  }

  // Additional metadata validation
  const isValidDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  };

  if (!isValidDate(profile.metadata.createdAt) || !isValidDate(profile.metadata.updatedAt)) {
    return false;
  }

  return true;
}