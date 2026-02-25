import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'tb_user', synchronize: false })
export class AigaUser {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  user_id: string;

  @Column()
  sns_type: string;

  @Column()
  sns_id: string;

  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column()
  profile_img: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  restricted_time: string;

  @Column()
  agreement: string;

  @Column()
  regist_date: Date;

  @Column()
  unregist_date: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  lastLoginAt: Date;

  total_token_usage: number;
}
