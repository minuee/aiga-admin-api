import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('hospital_alias')
export class HospitalAlias {
  @PrimaryGeneratedColumn({ name: 'aid', type: 'int' })
  aid: number;

  @Column()
  hid: string;

  @Column()
  standard_name: string;

  @Column()
  alias_name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  shortName: string;
}