import jwt from 'jsonwebtoken';
import { User } from '../domain/entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { UserRole } from '../domain/enums/UserRole';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async login(request: LoginRequest): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(request.email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await user.verifyPassword(request.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(request: RegisterRequest): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Validate email domain (optional: only allow university emails)
    if (!request.email.endsWith('@nu.edu.om')) {
      throw new Error('Only National University email addresses are allowed');
    }

    // Create new user (default role is STUDENT, unless specified)
    const role = request.role || UserRole.STUDENT;
    const userId = uuidv4();
    const user = new User(userId, request.name, request.email, role);

    await user.setPassword(request.password);
    await this.userRepository.save(user);

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await this.userRepository.findById(decoded.userId);
      return user;
    } catch (error) {
      return null;
    }
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
}
