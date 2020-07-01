select 
te.value, 
te.status, 
te.check_being_performed, 
te.last_modified_date,
tc.pre_target_values,
tc.target_values,
tc.disqualifying_values,
tc.name
from task_events te
inner join task_conditions tc on tc.id = te.task_condition_associated
order by tc.name, te.last_modified_date asc;