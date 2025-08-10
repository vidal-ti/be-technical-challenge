import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { Task } from '../../domain/entities/Task';
import { TaskStatus } from '../../domain/value-objects/TaskStatus';
import FirebaseConnection from '../database/firebase.config';
import { FieldValue } from 'firebase-admin/firestore';

export class FirebaseTaskRepository implements ITaskRepository {
  private db = FirebaseConnection.getInstance().getDb();
  private collection = 'tasks';

  async create(task: Task): Promise<Task> {
    const taskData = {
      title: task.title,
      description: task.description,
      status: task.status,
      userId: task.userId,
      createdAt: task.createdAt || FieldValue.serverTimestamp(),
      updatedAt: task.updatedAt || FieldValue.serverTimestamp(),
      completedAt: task.completedAt || null,
    };

    const docRef = await this.db.collection(this.collection).add(taskData);
    task.id = docRef.id;
    return task;
  }

  async findById(id: string): Promise<Task | null> {
    const doc = await this.db.collection(this.collection).doc(id).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data()!;
    return new Task(
      doc.id,
      data.title,
      data.description,
      data.status as TaskStatus,
      data.userId,
      data.createdAt?.toDate() || new Date(),
      data.updatedAt?.toDate() || new Date(),
      data.completedAt?.toDate() || null
    );
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const snapshot = await this.db
      .collection(this.collection)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return new Task(
        doc.id,
        data.title,
        data.description,
        data.status as TaskStatus,
        data.userId,
        data.createdAt?.toDate() || new Date(),
        data.updatedAt?.toDate() || new Date(),
        data.completedAt?.toDate() || null
      );
    });
  }

  async update(task: Task): Promise<Task> {
    const updateData: any = {
      title: task.title,
      description: task.description,
      status: task.status,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (task.completedAt !== undefined) {
      updateData.completedAt = task.completedAt || null;
    }

    await this.db.collection(this.collection).doc(task.id).update(updateData);
    return task;
  }

  async delete(id: string): Promise<void> {
    await this.db.collection(this.collection).doc(id).delete();
  }
}
