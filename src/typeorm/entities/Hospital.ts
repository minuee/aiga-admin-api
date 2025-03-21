import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

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

}
