
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ChatSearchProposal } from './ChatSearchProposal';

@Entity({ name: 'chat_search_log', synchronize: false })
export class ChatSearchLog {
  @PrimaryGeneratedColumn({ name: 'log_id', type: 'bigint', unsigned: true })
  logId: number;

  @Column({
    type: 'enum',
    enum: ['HOSPITAL', 'DOCTOR', 'ETC'],
    name: 'chat_type',
  })
  chatType: 'HOSPITAL' | 'DOCTOR' | 'ETC';

  @Column({ type: 'int', nullable: true, name: 'info_did' })
  infoDid: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'info_hid' })
  infoHid: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'info_name' })
  infoName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'info_hospital_name',
  })
  infoHospitalName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'info_deptname',
  })
  infoDeptname: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'proposal_raw',
  })
  proposalRaw: string;

  @Column({ type: 'int', nullable: true, name: 'chat_id' })
  chatId: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @OneToMany(
    () => ChatSearchProposal,
    (chatSearchProposal) => chatSearchProposal.log,
  )
  proposals: ChatSearchProposal[];
}
