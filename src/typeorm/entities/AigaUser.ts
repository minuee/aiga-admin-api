import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'tb_user',synchronize: false })
export class AigaUser {
  @PrimaryColumn()
  user_id: number;

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

  @Column()
  restricted_time: number;

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
}
