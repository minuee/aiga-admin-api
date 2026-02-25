import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_chatting' })
export class Chatting {
  @PrimaryGeneratedColumn()
  chat_id: number;

  @Column({ length: 40 })
  user_id: string;

  @Column({ length: 40 })
  session_id: string;

  @Column({ length: 191, nullable: true })
  chat_type: string;

  @Column('text')
  question: string;

  @Column('mediumtext', { nullable: true })
  answer: string;

  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  used_token: number;

  @Column()
  summary : string;

  @CreateDateColumn({ name: 'createAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updateAt', type: 'datetime', precision: 3, nullable: true })
  updateAt: Date;
}