import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from 'src/helpers/enums/task-status.enum';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
