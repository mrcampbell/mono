import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from "typeorm";
import { TaskConditionStage } from "./TaskConditionStages";

@Entity({ name: "task_conditions" })
@Unique("UQ_NAMES_PER_ORG", ["organization_id", "name"])
export class TaskCondition {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    length: 30,
    name: "organization_id",
  })
  organization_id?: string;

  @Column({
    nullable: false,
    name: "name",
  })
  name?: string;

  @Column({
    nullable: false,
    name: "object_type",
  })
  object_type?: string;

  @Column({
    nullable: false,
    name: "field_name",
  })
  field_name?: string;

  @OneToMany(type => TaskConditionStage, stage => stage.task_condition, {cascade: true, eager: true, nullable: false})
  stages?: TaskConditionStage[];
}
