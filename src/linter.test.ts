import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

describe('ESLint Configuration', () => {
  it('should run linter without errors', () => {
    try {
      // Run ESLint on the src directory
      execSync('npm run lint', { stdio: 'pipe' });
      expect(true).toBe(true);
    } catch (error) {
      console.error('Linting failed:', error.message);
      expect(false).toBe(true);
    }
  });
});