import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Municipality } from "./Municipality";

@Entity("states")
export class State {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 2 })
  uf!: string;

  @Column()
  name!: string;

  @OneToMany(() => Municipality, municipality => municipality.state)
  municipalities!: Municipality[];
}
