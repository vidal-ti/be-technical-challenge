import { TaskStatus } from '../value-objects/TaskStatus';

export class Task {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public status: TaskStatus,
    public userId: string,
    public createdAt: Date,
    public updatedAt: Date,
    public completedAt: Date | null = null
  ) {}

  static create(title: string, description: string, userId: string): Task {
    return new Task(
      '',
      title,
      description,
      TaskStatus.PENDING,
      userId,
      new Date(),
      new Date(),
      null
    );
  }

  markAsCompleted(): void {
    this.status = TaskStatus.COMPLETED;
    this.completedAt = new Date();
    this.updatedAt = new Date();
  }

  markAsPending(): void {
    this.status = TaskStatus.PENDING;
    this.completedAt = null;
    this.updatedAt = new Date();
  }
}
