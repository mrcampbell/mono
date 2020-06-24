import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { SalesforceMeta } from "./SalesforceMeta";

@Entity({ name: "users" })
export class User {
  @PrimaryColumn()
  id?: string;

  @Column({
    name: "organization_id",
  })
  organization_id?: string;

  @Column({
    name: "salesforce_user_id",
  })
  salesforce_user_id?: string;

  @Column({
    name: "salesforce_username",
  })
  salesforce_username?: string;

  @Column({
    name: "salesforce_profile_picture",
  })
  salesforce_profile_picture?: string;

  @Column({
    name: "salesforce_thumbnail_picture",
  })
  salesforce_thumbnail_picture?: string;

  @Column({
    nullable: false,
    name: "name",
  })
  name?: string;

  @Column({default: "now()"})
  first_logged_in_at?: Date

  @Column()
  last_logged_in_at?: Date

  @OneToOne(type => SalesforceMeta, {cascade: true, nullable: false, eager: true})
  @JoinColumn({name: "salesforce_meta_id"})
  salesforce_meta?: SalesforceMeta;
}
