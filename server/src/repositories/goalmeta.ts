import { GoalMeta } from "../types/hubbie"

const goalMeta: GoalMeta =
  {
    id: "123",
    user_id: "123",
    created_at: new Date(),
    updated_at: new Date(),
    start_date_key: "20200101",
    end_date_key: "20200601",
    monday_is_active: true,
    tuesday_is_active: true,
    wednesday_is_active: true,
    thursday_is_active: true,
    friday_is_active: true,
    saturday_is_active: false,
    sunday_is_active: false,
  }

export default class GoalMetaRepository {
  static ByUserID(id: string): GoalMeta {
    return goalMeta;
  }
}