import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToMany, JoinColumn, OneToMany } from "typeorm";
import { StreamEventFields } from "./StreamEventFields";

@Entity({ name: "stream_events" })
export class StreamEvent {
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
  change_type?: string; // created/updated

  @Column({
    nullable: false,
  })
  last_modified_by_id?: string;

  @Column({
    nullable: false,
  })
  last_modified_date_key?: string;

  @Column({
    nullable: false,
  })
  commit_timestamp?: Date;

  @OneToMany(type => StreamEventFields, field => field.stream_event, {cascade: true, eager: true, nullable: false})
  fields?: Array<StreamEventFields>;
}
