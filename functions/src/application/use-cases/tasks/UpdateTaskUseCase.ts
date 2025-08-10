import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { Task } from '../../../domain/entities/Task';
import { TaskStatus } from '../../../domain/value-objects/TaskStatus';

export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(
    id: string,
    userId: string,
    updates: { title?: string; description?: string; status?: TaskStatus }
  ): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new Error('Task not found');
    }

    if (task.userId !== userId) {
      throw new Error('Unauthorized');
    }

    // Actualizar campos
    if (updates.title) task.title = updates.title;
    if (updates.description) task.description = updates.description;

    if (updates.status) {
      if (updates.status === TaskStatus.COMPLETED) {
        task.markAsCompleted();
      } else {
        task.markAsPending();
      }
    }

    task.updatedAt = new Date();

    return await this.taskRepository.update(task);
  }
}
