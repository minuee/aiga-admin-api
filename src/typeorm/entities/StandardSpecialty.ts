import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('standardspecialty')
export class StandardSpecialty {
  @PrimaryGeneratedColumn({ type: 'int', name: 'spec_id' })
  spec_id: number;

  @Column('varchar', { name: 'standard_spec', nullable: true, length: 100 })
  standard_spec: string | null;

  @Column('varchar', { name: 'standard_group', nullable: true, length: 50 })
  standard_group: string | null;

  @Column('tinyint', { name: 'isAdult', nullable: true, width: 1 })
  isAdult: boolean | null;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date | null;
}