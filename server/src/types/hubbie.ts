export class TaskType {
  id?: string;
  name?: string;
  source?: string;
}

// pk is combo of user_id, date_key, task_id
export class Stat {
  user_id?: string
  count?: number;
  date_key?: string;
  task_id?: string;
}

export class Goal implements UserObject {
  id?: string;
  user_id?: string;
  created_at?: Date;
  updated_at?: Date;

  name?: string;
  task_id?: string;

  target_count?: number;
  daily_count?: number;
  weekly_count?: number;
}

export class GoalMeta implements UserObject {
  id?: string;
  user_id?: string;
  created_at?: Date;
  updated_at?: Date;

  start_date_key?: string;
  end_date_key?: string;

  monday_is_active?: boolean;
  tuesday_is_active?: boolean;
  wednesday_is_active?: boolean;
  thursday_is_active?: boolean;
  friday_is_active?: boolean;
  saturday_is_active?: boolean;
  sunday_is_active?: boolean;
}

export class User {
  id?: string; // nullable for unauthed requests
  email?: string;
  affiliate_organization_id?: string;
  affiliate_organization?: string = "salesforce";
  // goals?: Goal[];
  // goal_meta?: GoalMeta;
  // stats?: Stat[];
}
export interface UserObject {
  id?: string;
  user_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

