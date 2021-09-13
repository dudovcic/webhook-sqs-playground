import * as AWS from "aws-sdk";

const sqs = new AWS.SQS({ region: "eu-west-2" });

export const enqueueSQSMessage = (
  QueueUrl: string,
  messageBody: any,
  delay?: number
): Promise<void> => {
  return new Promise<void>(
    async (resolve: () => void, reject: (err: any) => void) => {
      sqs.sendMessage(
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
};
