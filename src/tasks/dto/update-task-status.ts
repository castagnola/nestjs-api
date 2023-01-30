import { IsEnum } from 'class-validator';
import { TaskStatus } from 'src/helpers/enums/task-status.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
