
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tb_token_reset_log' })
export class TokenResetLog {
  @PrimaryGeneratedColumn({ name: 'reset_id' })
  resetId: number;

  @Column({ name: 'user_id', type: 'varchar', length: 100, nullable: true })
  userId: string;

  @Column({ name: 'admin_user_id', type: 'varchar', length: 100, nullable: true })
  adminUserId: string;

  @Column({ name: 'reset_sum_token', type: 'int', default: 0 })
  resetSumToken: number;

  @CreateDateColumn({ name: 'reset_date', type: 'datetime' })
  resetDate: Date;
}
