import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AuthService } from '../../../infrastructure/services/AuthService';

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<{ userId: string; token: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await AuthService.comparePassword(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = AuthService.generateToken(user.id);

    return { userId: user.id, token };
  }
}
