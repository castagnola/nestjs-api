import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { TaskStatus } from '../enums/task-status.enum';
import { TasksService } from '../tasks.service';

const mockUser = {
  username: 'Ariel',
  id: 'someId',
  password: 'somePassword',
  task: [],
};
const mockTask = {
  title: 'Test title',
  description: 'Test  desc',
  id: 'someId',
  status: TaskStatus.OPEN,
  user: mockUser,
};

describe('TaksService', () => {
  let taskService: TasksService;
  let taskRepository: Repository<Task>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    taskService = moduleRef.get<TasksService>(TasksService);
    taskRepository = moduleRef.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  it('TaskRepository should be defined', () => {
    expect(taskRepository).toBeDefined();
  });

  describe('getTasks', () => {
    it('should be return an array with tasks', () => {
      // jest.spyOn(taskRepository, 'find').mockResolvedValue('someValue');
      // const result = taskService.getTasks(null, mockUser);
      // expect(result).toEqual('someValue');
    });
  });

  describe('getTaskbyId', () => {
    it('should calls TasksRepository.findOne and returns the result', () => {
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);
      expect(taskService.getTaskById('someId', mockUser));
    });

    it('should be return 404 error if Id not exist', () => {
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);
      expect(taskService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
