import Ajv from 'ajv';
import personalityProfileSchema from '../src/schemas/personality-profile.json';

describe('Personality Profile Schema', () => {
  let ajv;
  let validate;

  beforeEach(() => {
    ajv = new Ajv();
    validate = ajv.compile(personalityProfileSchema);
  });

  test('validates a complete valid personality profile', () => {
    const validProfile = {
      id: 'user123',
      basicInfo: {
        name: 'John Doe',
        age: 30,
        gender: 'male',
        contactPreferences: {
          communicationChannels: ['email', 'chat'],
          language: 'English'
        }
      },
      personalityTraits: {
        bigFive: {
          openness: 7,
          conscientiousness: 6,
          extraversion: 5,
          agreeableness: 8,
          neuroticism: 4
        },
        communicationStyle: 'analytical'
      },
      interactionPreferences: {
        conversationTopics: ['technology', 'science'],
        learningStyle: 'visual'
      },
      metadata: {
        additionalInfo: 'Extra context'
      }
    };

    const isValid = validate(validProfile);
    expect(isValid).toBe(true);
    expect(validate.errors).toBeNull();
  });

  test('rejects profile with invalid age', () => {
    const invalidProfile = {
      id: 'user123',
      basicInfo: {
        name: 'John Doe',
        age: 200,
        gender: 'male'
      },
      personalityTraits: {
        bigFive: {
          openness: 7,
          conscientiousness: 6,
          extraversion: 5,
          agreeableness: 8,
          neuroticism: 4
        },
        communicationStyle: 'analytical'
      }
    };

    const isValid = validate(invalidProfile);
    expect(isValid).toBe(false);
    expect(validate.errors).toBeTruthy();
    expect(validate.errors[0].message).toContain('must be <= 150');
  });

  test('rejects profile with invalid personality trait score', () => {
    const invalidProfile = {
      id: 'user123',
      basicInfo: {
        name: 'John Doe',
        age: 30,
        gender: 'male'
      },
      personalityTraits: {
        bigFive: {
          openness: 11,
          conscientiousness: 6,
          extraversion: 5,
          agreeableness: 8,
          neuroticism: 4
        },
        communicationStyle: 'analytical'
      }
    };

    const isValid = validate(invalidProfile);
    expect(isValid).toBe(false);
    expect(validate.errors).toBeTruthy();
    expect(validate.errors[0].message).toContain('must be <= 10');
  });

  test('requires minimum required fields', () => {
    const incompleteProfile = {
      id: 'user123',
      basicInfo: {
        name: 'John Doe'
      }
    };

    const isValid = validate(incompleteProfile);
    expect(isValid).toBe(false);
    expect(validate.errors).toBeTruthy();
  });
});