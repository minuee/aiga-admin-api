
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ChatSearchLog } from './ChatSearchLog';

@Entity({ name: 'chat_search_proposal', synchronize: false })
export class ChatSearchProposal {
  @PrimaryGeneratedColumn({ name: 'proposal_id', type: 'bigint', unsigned: true })
  proposalId: number;

  @Column({ name: 'log_id', type: 'bigint', unsigned: true })
  logId: number;

  @Column({ name: 'group_id', type: 'bigint', unsigned: true })
  groupId: number;

  @Column({ type: 'varchar', length: 50 })
  keyword: string;

  @ManyToOne(() => ChatSearchLog, (chatSearchLog) => chatSearchLog.proposals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'log_id' })
  log: ChatSearchLog;
}
