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


@Entity('tb_notice',{schema: 'clone_slack' ,synchronize: false })
export class Notice { // Changed from Hospital to Review

  @PrimaryColumn()
  notice_id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  is_active: string;

  @Column()
  open_date: string;

  @Column()
  writer: string;
  
  @Column()
  createAt: Date;

  @Column()
  updateAt: Date;
}
