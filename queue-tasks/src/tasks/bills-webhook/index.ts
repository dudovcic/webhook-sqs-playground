import { Consumer, SQSMessage } from "sqs-consumer";

interface BillsWebhookMessagePayload {
  provier: "gas" | "internet";
  callbackurl: string;
}

export class BillsWebhookTask {
  private app: Consumer;

  constructor(queueUrl: string, batchSize?: number) {
    this.app = Consumer.create({
      queueUrl: queueUrl,
      batchSize,
      handleMessage: this.handler,
    });

    this.app.on("error", this.onError);
    this.app.on("processing_error", this.onProcessingError);
  }

  private async handler(message: SQSMessage) {
    const payload = JSON.parse(message.Body!) as BillsWebhookMessagePayload;

    payload;
  }

  private onError(err: Error) {
    console.error(err);
  }

  private onProcessingError(err: Error) {
    console.error(err);
  }

  public start() {
    this.app.start();
  }
}
