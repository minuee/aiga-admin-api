import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DoctorSpecialty } from './DoctorSpecialty';

@Entity({ name: 'specialty' })
export class Specialty {
  @PrimaryGeneratedColumn({ type: 'int', name: 'specialty_id' })
  specialty_id: number;

  @Column('varchar', { name: 'specialty', length: 50 })
  specialty: string;

  @Column('datetime', {
    name: 'createAt',
    nullable: true,
  })
  createAt: Date;

  @Column('datetime', { name: 'updateAt', nullable: true })
  updateAt: Date | null;

  @Column('tinyint', { name: 'data_version_id', unsigned: true, default: () => "'1'" })
  data_version_id: number;

  @OneToMany(() => DoctorSpecialty, (doctorSpecialty) => doctorSpecialty.specialty)
  doctorSpecialties: DoctorSpecialty[];
}
