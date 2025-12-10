import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Occurrence } from './Occurrence';

@Entity('occurrence_images')
export class OccurrenceImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  filename!: string;

  @Column()
  path!: string;

  // Adicione esta coluna explicitamente
  @Column()
  occurrenceId!: string;

  @ManyToOne(() => Occurrence, occurrence => occurrence.images)
  @JoinColumn({ name: 'occurrenceId' }) // Especifica a coluna de junção
  occurrence!: Occurrence;

  @CreateDateColumn()
  createdAt!: Date;
}