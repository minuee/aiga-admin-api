import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('data_history')
export class DataHistory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'data_version_id' })
  data_version_id: number;

  @Column('varchar', { name: 'part', length: 50, default: 'all' })
  part: string;

  @Column('varchar', { name: 'title', nullable: true, length: 100 })
  title: string | null;

  @Column('datetime', { name: 'collect_start', nullable: true })
  collect_start: Date | null;

  @Column('datetime', { name: 'collect_end', nullable: true })
  collect_end: Date | null;

  @Column('varchar', { name: 'memo', nullable: true, length: 1024 })
  memo: string | null;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date | null;
}
