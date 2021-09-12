import { BillsWebhookTask } from './tasks/bills-webhook';

const tasks = [
  new BillsWebhookTask('https://sqs.eu-west-2.amazonaws.com/334964088068/bills-queue', 10)
]

const runTasks = () => {
  for (const t of tasks) {
    t.start();
  }
}

runTasks();