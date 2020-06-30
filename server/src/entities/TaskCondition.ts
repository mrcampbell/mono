import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

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

  @Column({
    nullable: false,
    name: "pre_target_values",
    type: 'text',
    array: true,
  })
  pre_target_values?: string[];

  @Column({
    nullable: false,
    name: "target_values",
    type: 'text',
    array: true
  })
  target_values?: string[];

  @Column({
    nullable: false,
    name: "disqualifying_values",
    type: 'text',
    array: true,
  })
  disqualifying_values?: string[];
}
