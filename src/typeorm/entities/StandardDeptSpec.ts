import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('standard_dept_spec')
export class StandardDeptSpec {
  @PrimaryGeneratedColumn({ type: 'int', name: 'dept_spec_id' })
  dept_spec_id: number;

  @Column('varchar', { name: 'standard_dept', nullable: true, length: 100 })
  standard_dept: string | null;

  @Column('json', { name: 'standard_spec', nullable: true })
  standard_spec: string[] | null; // JSON array of strings

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date | null;
}
