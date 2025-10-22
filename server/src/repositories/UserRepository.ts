import { IRepository } from './IRepository';
import { User } from '../domain/entities/User';
import { UserRole } from '../domain/enums/UserRole';

export class UserRepository implements IRepository<User> {
  private users: Map<string, User> = new Map();

  constructor() {
    this.seedUsers();
  }

  private async seedUsers() {
    // Create default admin user
    const admin = new User('admin-1', 'Admin User', 'admin@nu.edu.om', UserRole.ADMIN);
    await admin.setPassword('admin123');
    this.users.set(admin.id, admin);

    // Create default student user
    const student = new User('student-1', 'Student User', 'student@nu.edu.om', UserRole.STUDENT);
    await student.setPassword('student123');
    this.users.set(student.id, student);
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async save(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async update(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}
