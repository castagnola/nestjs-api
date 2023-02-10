import { Exclude } from 'class-transformer';
import { TaskStatus } from '../../tasks/enums/task-status.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne((_type) => User, (user) => user.task, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
