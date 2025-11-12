import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  Double,
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
  address: string;

  @Column()
  telephone: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  lon: number;

  @Column()
  createAt: Date;

  @Column()
  updateAt: Date;

  @OneToOne(() => Doctor, (doctor_basic) => doctor_basic.hid )
  @JoinColumn({ name : 'hid'})
  doctor_basic : Doctor;

}
