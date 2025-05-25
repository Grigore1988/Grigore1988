export class AuthService {
  async validateUser(userId: string): Promise<any> {
    // Mock user validation for now
    return {
      id: userId,
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };
  }
}