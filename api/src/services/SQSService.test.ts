import { SQSService } from "./SQSService";

describe("SQSService", () => {
  const sqsMock = {
    sendMessage: jest.fn((_params, func) => func()),
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should send message correctly", async () => {
    const sqsService = new SQSService(sqsMock as any);

    await sqsService.enqueueSQSMessage("queueUrl", { message: "example" });

    expect(sqsMock.sendMessage).toHaveBeenCalledWith(
      {
        DelaySeconds: undefined,
        MessageBody: '{"message":"example"}',
        QueueUrl: "queueUrl",
      },
      expect.anything()
    );
  });
});
