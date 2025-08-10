import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import FirebaseConnection from '../database/firebase.config';

export class FirebaseUserRepository implements IUserRepository {
  private db = FirebaseConnection.getInstance().getDb();
  private collection = 'users';

  async create(user: User): Promise<User> {
    const docRef = await this.db.collection(this.collection).add({
      email: user.email,
      password: user.password,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    user.id = docRef.id;
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.db
      .collection(this.collection)
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return new User(
      doc.id,
      data.email,
      data.password,
      data.name,
      data.createdAt.toDate(),
      data.updatedAt.toDate()
    );
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.db.collection(this.collection).doc(id).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data()!;
    return new User(
      doc.id,
      data.email,
      data.password,
      data.name,
      data.createdAt.toDate(),
      data.updatedAt.toDate()
    );
  }
}
