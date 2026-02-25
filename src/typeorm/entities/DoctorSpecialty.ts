import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Doctor } from './Doctor';
import { Specialty } from './Specialty';

@Entity({ name: 'doctor_specialty' })
@Unique(['doctor_id', 'specialty_id'])
export class DoctorSpecialty {
  @PrimaryGeneratedColumn({ type: 'int', name: 'doctor_specialty_id' })
  doctor_specialty_id: number;

  @Column({ type: 'int', name: 'specialty_id' })
  specialty_id: number;

  @Column({ type: 'int', name: 'doctor_id' })
  doctor_id: number;

  @Column('datetime', {
    name: 'createAt',
    nullable: true,
  })
  createAt: Date;

  @Column('datetime', { name: 'updateAt', nullable: true })
  updateAt: Date | null;

  @Column('tinyint', { name: 'data_version_id', unsigned: true, default: () => "'1'" })
  data_version_id: number;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(() => Specialty, (specialty) => specialty.doctorSpecialties)
  @JoinColumn({ name: 'specialty_id' })
  specialty: Specialty;
}
