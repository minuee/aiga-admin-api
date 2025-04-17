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

@Entity('hospital',{schema: 'clone_slack' ,synchronize: false })
export class Hospital {

  @PrimaryColumn()
  hid: string;

  @Column()
  baseName: string;

  @Column()
  shortName: string;

  @Column()
  createAt: Date;

  @Column()
  updateAt: Date;

  @OneToOne(() => Doctor, (doctor_basic) => doctor_basic.hid )
  @JoinColumn({ name : 'hid'})
  doctor_basic : Doctor;

}
