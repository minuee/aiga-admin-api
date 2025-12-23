import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tb_chatting' })
export class Chatting {
  @PrimaryGeneratedColumn()
  chat_id: number;

  @Column()
  user_id: number;

  @CreateDateColumn({ name: 'createAt' })
  createdAt: Date;

  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  used_token: number;
}
