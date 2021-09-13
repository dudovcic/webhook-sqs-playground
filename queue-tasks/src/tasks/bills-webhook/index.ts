import { Consumer, SQSMessage } from "sqs-consumer";
import { getRequest, postRequest } from "../../utils/request";
import { enqueueSQSMessage } from "../../utils/sqs";
import { retry } from "../../utils/retry";

const QUEUE_RETRY_DELAY = 5 * 60;
interface BillsWebhookMessagePayload {
  provider: "gas" | "internet";
  callbackUrl: string;
}

export class BillsWebhookTask {
  private app: Consumer;

  constructor(private queueUrl: string, batchSize?: number) {
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

    const result = await getRequest(
      `http://datahog:3000/providers/${payload.provider}`
    );

    if (result.statusCode === 200) {
      // webhook
      retry(
        async () => {
          const res = await postRequest(
            payload.callbackUrl,
            JSON.stringify(result.body)
          );
          //   normally no need to retry 400
          if (res.statusCode !== 200 && res.statusCode !== 400) {
            throw new Error("Error on webhook");
          }
        },
        3,
        5
      );
    } else {
      await enqueueSQSMessage(
        this.queueUrl,
        payload,
        QUEUE_RETRY_DELAY
      );
    }
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
