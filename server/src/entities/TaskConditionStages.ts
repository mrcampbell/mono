import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToOne, JoinColumn } from "typeorm";
import { TaskCondition } from "./TaskCondition";

@Entity({ name: "task_condition_stages" })
export class TaskConditionStage {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    nullable: false,
    name: "values",
    type: "text",
    array: true,
  })
  values?: string[]

  @Column({
    nullable: false,
    default: 'qualifying'
  })
  stage_type?: 'target' | 'disqualifying'

  @ManyToOne(type => TaskCondition, condition => condition.stages)
  @JoinColumn({ name: 'task_condition_id' })
  task_condition?: TaskCondition
}
