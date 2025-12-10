import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne,
  CreateDateColumn,
  OneToMany
} from 'typeorm';

import { Occurrence } from './Occurrence';
import { State } from './State';

@Entity('municipalities')
export class Municipality {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => State, state => state.municipalities, { eager: true })
  state!: State;

  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Occurrence, occurrence => occurrence.municipality)
  occurrences!: Occurrence[];
}
