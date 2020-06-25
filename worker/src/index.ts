import { progressUpdateQueue } from "./bull/connect";

let count = 0;

setInterval(() => {
  progressUpdateQueue.add({
    user_id: "user_123",
    progresses: [
      {
        task_id: "123",
        date_key: "20200102",
        count,
      },
    ],
  });
  count++;
  console.log('worker fired off event')
}, 3000);
