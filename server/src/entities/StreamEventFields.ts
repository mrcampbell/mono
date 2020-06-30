import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToMany, JoinColumn } from "typeorm";

@Entity({ name: "stream_event_fields" })
export class StreamEventFields {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    nullable: false,
  })
  field?: string;

  @Column({
    nullable: false,
  })
  value?: string;
}
