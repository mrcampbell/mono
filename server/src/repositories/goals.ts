import { Goal } from "../types/hubbie";

const goals: Goal[] = [
  {
    id: "123",
    name: "sell 32 widgets",
    created_at: new Date(),
    updated_at: new Date(),
    daily_count: 1,
    target_count: 2,
    weekly_count: 3,
    task_id: "SALESFORCE_OPPORTUNITY_CLOSED_WON",
    user_id: "123",
  },
  {
    id: "124",
    name: "make calls",
    created_at: new Date(),
    updated_at: new Date(),
    daily_count: 1,
    target_count: 2,
    weekly_count: 3,
    task_id: "SALESFORCE_CALLS_MADE",
    user_id: "123",
  },
  {
    id: "125",
    name: "send emails",
    created_at: new Date(),
    updated_at: new Date(),
    daily_count: 1,
    target_count: 2,
    weekly_count: 3,
    task_id: "SALESFORCE_EMAILS_SENT",
    user_id: "123",
  },
];


export default class GoalRepository {
  static ByUserID(id: string): Goal[] {
    return goals;
  }
}