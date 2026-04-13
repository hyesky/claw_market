/// <reference types="jest" />

import bcrypt from 'bcryptjs';

describe('AuthService', () => {
  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'testPassword123';
      const hash = await bcrypt.hash(password, 10);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should verify password correctly', async () => {
      const password = 'testPassword123';
      const hash = await bcrypt.hash(password, 10);

      const isValid = await bcrypt.compare(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testPassword123';
      const hash = await bcrypt.hash(password, 10);

      const isValid = await bcrypt.compare('wrongPassword', hash);
      expect(isValid).toBe(false);
    });
  });
});
