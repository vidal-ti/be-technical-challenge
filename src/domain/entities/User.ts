export class User {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public name: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(email: string, password: string, name: string): User {
    return new User('', email, password, name, new Date(), new Date());
  }
}
