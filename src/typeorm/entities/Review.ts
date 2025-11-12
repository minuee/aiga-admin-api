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
import { Hospital } from './Hospital'; // Import Hospital for type hinting if needed elsewhere, but not for direct relation here

@Entity('tb_review',{schema: 'clone_slack' ,synchronize: false })
export class Review { // Changed from Hospital to Review

  @PrimaryColumn()
  review_id: string;

  @Column()
  baseName: string;

  @Column()
  user_id: string;

  @Column()
  doctor_id: string;

  @Column()
  content: string;

  @Column()
  nickname: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  total_score: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  kindness_score: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  explaination_score: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  satisfaction_score: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  recommand_score: number;

  @Column()
  createAt: Date;

  @Column()
  updateAt: Date;
}
