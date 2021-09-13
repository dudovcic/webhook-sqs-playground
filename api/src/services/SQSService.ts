export class SQSService {
  constructor(private sqs: AWS.SQS) {}

  public enqueueSQSMessage(
    QueueUrl: string,
    messageBody: any,
    delay?: number
  ): Promise<void> {
    return new Promise<void>(
      async (resolve: () => void, reject: (err: any) => void) => {
        this.sqs.sendMessage(
          {
            QueueUrl,
            MessageBody: JSON.stringify(messageBody),
            DelaySeconds: delay,
          },
          (err: AWS.AWSError) => {
            if (err) {
              return reject(err);
            }

            resolve();
          }
        );
      }
    );
  }
}
