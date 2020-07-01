import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToMany, JoinColumn, ManyToOne } from "typeorm";
import { StreamEvent } from "./StreamEvent";

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

  @ManyToOne(type => StreamEvent, event => event.fields)
  @JoinColumn({ name: 'stream_event_id' })
  stream_event?: StreamEvent
}
