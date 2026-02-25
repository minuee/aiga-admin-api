import { Column, Entity, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('doctor_evaluation')
export class DoctorEvaluation {
  @PrimaryGeneratedColumn({ type: 'int', name: 'doctor_eval_id' })
  doctorEvalId: number;

  @Column('int', { name: 'doctor_id' })
  @Index('idx_doctor_eval_doctor_id') // doctor_id로 인덱스 추가
  doctorId: number;

  @Column('int', { name: 'data_version_id' })
  dataVersionId: number;

  @Column('varchar', { name: 'standard_spec', nullable: true, length: 20 })
  standardSpec: string | null;

  @Column('double', { name: 'kindness', nullable: true, precision: 22 })
  kindness: number | null;

  @Column('double', { name: 'satisfaction', nullable: true, precision: 22 })
  satisfaction: number | null;

  @Column('double', { name: 'explanation', nullable: true, precision: 22 })
  explanation: number | null;

  @Column('double', { name: 'recommendation', nullable: true, precision: 22 })
  recommendation: number | null;

  @Column('double', { name: 'patient_score', nullable: true, precision: 22 })
  patientScore: number | null;

  @Column('double', { name: 'paper_score', nullable: true, precision: 22 })
  paperScore: number | null;

  @Column('double', { name: 'public_score', nullable: true, precision: 22 })
  publicScore: number | null;

  @Column('text', { name: 'peer_score', nullable: true })
  peerScore: string | null;

  @CreateDateColumn({ type: 'datetime', name: 'createAt' })
  createAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updateAt', nullable: true })
  updateAt: Date | null;
}
