import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { Task } from '../../../domain/entities/Task';

export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(title: string, description: string, userId: string): Promise<Task> {
    const task = Task.create(title, description, userId);
    return await this.taskRepository.create(task);
  }
}
