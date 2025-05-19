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

@Entity('doctor_paper',{schema: 'clone_slack' ,synchronize: false })

export class DoctorPaper {

  @PrimaryColumn()
  paper_id: string;

  @Column()
  rid: string;

  @Column()
  data_version_id: string;
  
  @Column()
  doctorName: string;
  
  @Column()
  title: string;
  
  @Column()
  doi: string;

  @Column()
  journalName: string;

  @Column()
  authorRule: string;
  
  @Column()
  publicationDate: string;

  @Column()
  paper_url: string;
  
  @Column()
  abstract: string;
  
  @Column()
  keywords: string;

  @Column()
  impactFactor: string;
  
  @Column()
  totalCitations: string;

  @Column()
  authorName: string;

  /* @Column()
  firstAuthors : string;
  1stAuthors : string;
 */
  @Column()
  title_pubmed: string;

  @Column()
  pmid: string;
  
  @Column()
  authors: string;
  
  @Column()
  createAt: Date;

  @Column()
  updateAt: Date;

  @OneToOne(() => DoctorPaper, (doctor_basic) => doctor_basic.rid )
  @JoinColumn({ name : 'rid'})
  doctor_basic : Doctor;

}