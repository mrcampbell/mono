import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToMany, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: "task_status" })
@Unique("uq_task_status", ["task_condition_id", "object_id"])
export class TaskStatus {
  @Column({ // TODO: ManyToMany
    nullable: false,
  })
  user_id?: string;

  @Column({ // TODO: ManyToMany
    nullable: false,
  })
  object_id?: string;

  @Column({
    nullable: false,
  })
  date_key?: string;

  @Column({ // TODO: ManyToMany
    nullable: false,
  })
  task_condition_id?: string;

  @Column({
    nullable: false,
  })
  status?: 'complete' | 'disqualified' | 'pre-target';
  
}
