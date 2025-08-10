import { Request, Response } from 'express';
import { CreateTaskUseCase } from '../../application/use-cases/tasks/CreateTaskUseCase';
import { GetTasksUseCase } from '../../application/use-cases/tasks/GetTasksUseCase';
import { UpdateTaskUseCase } from '../../application/use-cases/tasks/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '../../application/use-cases/tasks/DeleteTaskUseCase';
import { FirebaseTaskRepository } from '../../infrastructure/repositories/FirebaseTaskRepository';

export class TaskController {
  private createTaskUseCase: CreateTaskUseCase;
  private getTasksUseCase: GetTasksUseCase;
  private updateTaskUseCase: UpdateTaskUseCase;
  private deleteTaskUseCase: DeleteTaskUseCase;

  constructor() {
    const taskRepository = new FirebaseTaskRepository();
    this.createTaskUseCase = new CreateTaskUseCase(taskRepository);
    this.getTasksUseCase = new GetTasksUseCase(taskRepository);
    this.updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
    this.deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
  }

  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description } = req.body;
      const userId = (req as any).userId;

      const task = await this.createTaskUseCase.execute(title, description, userId);

      res.status(201).json({
        success: true,
        data: task,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

  getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;

      const tasks = await this.getTasksUseCase.execute(userId);

      res.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

  updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;
      const updates = req.body;

      const task = await this.updateTaskUseCase.execute(id, userId, updates);

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

  deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      await this.deleteTaskUseCase.execute(id, userId);

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };
}
