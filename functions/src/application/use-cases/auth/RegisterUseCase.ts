import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { AuthService } from '../../../infrastructure/services/AuthService';

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: User; token: string }> {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(password);

    // Crear usuario
    const user = User.create(email, hashedPassword, name);
    const savedUser = await this.userRepository.create(user);

    // Generar token
    const token = AuthService.generateToken(savedUser.id);

    return { user: savedUser, token };
  }
}
