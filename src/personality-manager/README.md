# Personality Profile Validation

## Overview
This module provides validation logic for personality profiles in the multi-agent chatbot platform.

## Key Features
- Comprehensive profile validation
- Detailed error reporting
- Strict validation rules for profile integrity

## Validation Criteria
- ID: Must be non-empty
- Name: At least 2 characters long
- Tone: Must be specified
- Description: At least 10 characters long
- Sample Prompts: At least one prompt, each at least 5 characters
- Traits: At least one trait must be defined

## Usage Example
```typescript
const profile = { ... }; // Your personality profile
const errors = PersonalityProfileValidator.validate(profile);
if (errors.length > 0) {
  console.log('Profile validation failed:', errors);
}
```

## Testing
All validation rules are thoroughly tested using Vitest.