import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/db/task.entity';
import { TaskStatus } from 'src/helpers/enums/task-status.enum';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
  ) {}

  getTasks = async (filterDto: GetTasksFilterDto): Promise<Task[]> => {
    const { status, search } = filterDto;
    const query = this.tasksRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('taks.status = :status', { status: 'OPEN' });
    }
    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  };

  getTaskById = async (id: string): Promise<Task> => {
    const task = await this.tasksRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Resource ${id} not found`);
    }

    return task;
  };

  createTask = async (createTaskDto: CreateTaskDto): Promise<Task> => {
    const { title, description } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.tasksRepository.save(task);

    return task;
  };

  deleteTask = async (id: string): Promise<void> => {
    const item = await this.tasksRepository.delete(id);

    if (item.affected === 0) {
      throw new NotFoundException(`Taks with ID ${id} not found`);
    }
  };
  updateTaskStatus = async (id: string, status: TaskStatus): Promise<Task> => {
    const task = await this.getTaskById(id);

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  };
}
