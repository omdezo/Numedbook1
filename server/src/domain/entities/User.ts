import { Entity } from './Entity';
import { UserRole } from '../enums/UserRole';
import bcrypt from 'bcryptjs';

export class User extends Entity {
  constructor(
    id: string,
    public name: string,
    public email: string,
    public readonly role: UserRole,
    private passwordHash?: string
  ) {
    super(id);
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isStudent(): boolean {
    return this.role === UserRole.STUDENT;
  }

  async setPassword(password: string): Promise<void> {
    this.passwordHash = await bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string): Promise<boolean> {
    if (!this.passwordHash) return false;
    return bcrypt.compare(password, this.passwordHash);
  }

  getPasswordHash(): string | undefined {
    return this.passwordHash;
  }

  // For creating user from stored data
  static createWithHash(
    id: string,
    name: string,
    email: string,
    role: UserRole,
    passwordHash: string
  ): User {
    const user = new User(id, name, email, role);
    user.passwordHash = passwordHash;
    return user;
  }
}
