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


@Entity('tb_opinion',{schema: 'clone_slack' ,synchronize: false })
export class Opinion { // Changed from Hospital to Review

  @PrimaryColumn()
  opinion_id: string;

  @Column()
  user_id: string;

  @Column()
  opinion_type: string;

  @Column()
  doctor_id: string;

  @Column()
  title: string;

  @Column()
  content: string;
  
  @Column()
  memo: string;

  @Column()
  is_clear: string;

  @Column()
  createAt: Date;

  @Column()
  updateAt: Date;
}
