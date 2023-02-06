import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/db/task.entity';
import { User } from 'src/db/user.entity';
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

  getTasks = async (
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> => {
    const { status, search } = filterDto;
    const query = this.tasksRepository.createQueryBuilder('task');

    query.where({ user });
    if (status) {
      query.andWhere('taks.status = :status', { status: 'OPEN' });
    }
    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      //Log
      throw new InternalServerErrorException();
    }
  };

  getTaskById = async (id: string, user: User): Promise<Task> => {
    const task = await this.tasksRepository.findOne({ where: { id, user } });

    if (!task) {
      throw new NotFoundException(`Resource ${id} not found`);
    }

    return task;
  };

  createTask = async (
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> => {
    const { title, description } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    console.log(task);

    await this.tasksRepository.save(task);

    return task;
  };

  deleteTask = async (id: string, user: User): Promise<void> => {
    const item = await this.tasksRepository.delete({ id, user });

    if (item.affected === 0) {
      throw new NotFoundException(`Taks with ID ${id} not found`);
    }
  };

  updateTaskStatus = async (
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> => {
    const task = await this.getTaskById(id, user);

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  };
}
