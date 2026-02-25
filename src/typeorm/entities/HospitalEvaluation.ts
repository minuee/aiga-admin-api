import { Column, Entity, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('hospital_evaluation')
export class HospitalEvaluation {
  @PrimaryGeneratedColumn({ type: 'int', name: 'hospital_eval_id' })
  hospitalEvalId: number;

  @Column('varchar', { name: 'hid', length: 255 })
  @Index('idx_hospital_eval_hid')
  hid: string;

  @Column('int', { name: 'data_version_id' })
  @Index('idx_hospital_eval_version_hid')
  dataVersionId: number;

  @Column('varchar', { name: 'matched_dept', nullable: true, length: 255 })
  @Index('idx_dept_score')
  @Index('idx_hid_dept_public_score')
  matchedDept: string | null;

  @Column('decimal', {
    name: 'public_score',
    nullable: true,
    precision: 6,
    scale: 5,
  })
  @Index('idx_dept_score')
  @Index('idx_hid_dept_public_score')
  publicScore: number | null;

  @CreateDateColumn({ type: 'datetime', name: 'createAt' })
  createAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updateAt', nullable: true })
  updateAt: Date | null;
}
