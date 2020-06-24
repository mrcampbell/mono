import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm";

@Entity({name: "salesforce_metas"})
export class SalesforceMeta {
  @PrimaryColumn()
  id?: string;

  @Column({
    unique: true,
  })
  organization_id?: string;

  @Column({
    length: 200,
    nullable: false,
  })
  access_token?: string;

  @Column({
    length: 200,
    nullable: false,
  })
  refresh_token?: string;

  @Column({
    length: 200,
    nullable: false,
  })
  instance_url?: string;

  @Column('integer')
  issued_at?: number;

  @Column({type: 'timestamp with time zone', nullable: true})
  initialized_at?: Date;

  @Column({type: 'timestamp with time zone', nullable: true})
  last_transmission?: Date;

  @Column({type: 'timestamp with time zone', nullable: true})
  last_health_check?: Date;

  @Column()
  stream_is_live?: boolean;
}
