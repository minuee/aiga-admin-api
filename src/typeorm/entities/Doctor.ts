import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { DoctorCareer } from './DoctorCareer';

@Entity('doctor_basic',{schema: 'clone_slack' ,synchronize: false })

export class Doctor {

  @PrimaryColumn()
  rid: string;

  @Column()
  hid: string;

  @Column()
  data_version_id: string;
  
  @Column()
  deptname: string;
  
  @Column()
  doctorname: string;
  
  @Column()
  doctor_url: string;
  
  @Column()
  prev_rid: string;

  @Column()
  doctor_id: string;
  
  @Column()
  short_rid: string;

  @Column()
  specialties: string;

  @Column()
  profileimgurl: string;

  @Column()
  local_img: string;

  @Column()
  standard_dpt: string;

  @Column()
  standard_spec: string;
  
  @Column()
  createAt: Date;

  @Column()
  updateAt: Date;

  @OneToOne(() => DoctorCareer, (doctor_career) => doctor_career.rid )
  @JoinColumn({ name : 'rid'})
  doctor_career : DoctorCareer;
}