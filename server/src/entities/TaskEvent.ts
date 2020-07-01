import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToMany, ManyToOne, Unique } from "typeorm";
import { TaskCondition } from "./TaskCondition";

@Entity({ name: "task_events" })
// @Unique('unique_event', ['object_id', 'object_type', 'status', 'task_condition_associated'])
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
  value?: string;


  @Column({
    nullable: false,
  })
  last_modified_by_id?: string;

  @Column({
    nullable: false,
  })
  last_modified_date?: Date;

  @Column({
    nullable: false,
  })
  status?: 'pre-target met' | 'disqualified' | 'target hit' | 'neutral'

  @Column({
    nullable: false,
  })
  check_being_performed?: 'disqualify' | 'pre-target' | 'target';

  @ManyToOne(type => TaskCondition, {eager: true, nullable: true})
  @JoinColumn({name: 'task_condition_associated'})
  task_condition_associated?: TaskCondition;
}
