import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Doctor } from './Doctor';

@Entity('doctor_career',{schema: 'clone_slack' ,synchronize: false })

export class DoctorCareer {

  @PrimaryColumn()
  rid: string;

  @Column()
  data_version_id: string;
  
  @Column()
  education: string;
  
  @Column()
  career: string;
  
  @Column()
  etc: string;

  @Column()
  jsondata: string;
  
  @Column()
  createAt: Date;

  @Column()
  updateAt: Date;

  @OneToOne(() => DoctorCareer, (doctor_basic) => doctor_basic.rid )
  @JoinColumn({ name : 'rid'})
  doctor_basic : Doctor;

}