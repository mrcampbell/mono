import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToMany, JoinColumn } from "typeorm";
import { TaskCondition } from "./TaskCondition";

@Entity({ name: "task_events" })
export class TaskEvent {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    length: 30,
  })
  organization_id?: string;

  @Column({
    nullable: false,
  })
  object_id?: string;

  @Column({
    nullable: false,
  })
  object_type?: string;

  @Column({
    nullable: false,
  })
  last_modified_by_id?: string;

  @Column({
    nullable: false,
  })
  last_modified_date_key?: string;

  @ManyToMany(type => TaskCondition, {nullable: false, eager: true})
  @JoinColumn({name: "id"})
  task_conditions_met?: TaskCondition[];
}
