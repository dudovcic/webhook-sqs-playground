describe("BillsWebhookTask", () => {
  describe("when third parties work", () => {
    const startSpy = jest.fn();
    const createConsumerMock = jest.fn(() => {
      return {
        on: jest.fn(),
        start: startSpy,
      };
    });
    const sqsConsumerMock = {
      Consumer: {
        create: createConsumerMock,
      },
    };
    const sqsEnqueueMock = jest.fn();
    const getRequestMock = jest.fn(async () => ({
      statusCode: 200,
      body: { provider: "gas", callbackUrl: "http://callback.com" },
    }));
    const postRequestMock = jest.fn(async () => ({
      statusCode: 200,
      body: {},
    }));

    jest.mock("sqs-consumer", () => sqsConsumerMock);
    jest.mock("../../utils/sqs", () => ({
      enqueueSQSMessage: sqsEnqueueMock,
    }));
    const requestsMock = {
      getRequest: getRequestMock,
      postRequest: postRequestMock,
    };
    jest.mock("../../utils/request", () => requestsMock);

    const { BillsWebhookTask } = require(".");
    it("should initialise", () => {
      new BillsWebhookTask("sqs.queuee.url", 3);

      expect(createConsumerMock).toHaveBeenCalledWith({
        batchSize: 3,
        handleMessage: expect.anything(),
        queueUrl: "sqs.queuee.url",
      });
    });

    it("should initialise app and handle webhook", async () => {
      const billsWebhook = new BillsWebhookTask("sqs.queuee.url", 3);

      billsWebhook.start();

      expect(startSpy).toHaveBeenCalled();

      await (billsWebhook as any).handler({
        Body: JSON.stringify({
          provider: "gas",
          callbackUrl: "http://callback.com/examplee",
        }),
      });

      expect(getRequestMock).toHaveBeenCalledWith(
        "http://datahog:3000/providers/gas"
      );
      expect(postRequestMock).toHaveBeenCalledWith(
        "http://callback.com/examplee",
        '{"provider":"gas","callbackUrl":"http://callback.com"}'
      );
    });
  });
  describe("when third party provider fails", () => {
    jest.resetModules();
    const startSpy = jest.fn();
    const createConsumerMock = jest.fn(() => {
      return {
        on: jest.fn(),
        start: startSpy,
      };
    });
    const sqsConsumerMock = {
      Consumer: {
        create: createConsumerMock,
      },
    };
    const sqsEnqueueMock = jest.fn();
    const getRequestMock = jest.fn(async () => ({
      statusCode: 500,
    }));
    const postRequestMock = jest.fn(async () => ({
      statusCode: 200,
      body: {},
    }));

    jest.mock("sqs-consumer", () => sqsConsumerMock);
    jest.mock("../../utils/sqs", () => ({
      enqueueSQSMessage: sqsEnqueueMock,
    }));
    const requestsMock = {
      getRequest: getRequestMock,
      postRequest: postRequestMock,
    };
    jest.mock("../../utils/request", () => requestsMock);

    const { BillsWebhookTask } = require(".");
    it("should enqueue when a service fails", async () => {
      const billsWebhook = new BillsWebhookTask("sqs.queuee.url", 3);

      await (billsWebhook as any).handler({
        Body: JSON.stringify({
          provider: "gas",
          callbackUrl: "http://callback.com/examplee",
        }),
      });

      expect(getRequestMock).toHaveBeenCalledWith(
        "http://datahog:3000/providers/gas"
      );
      expect(postRequestMock).not.toHaveBeenCalled();

      expect(sqsEnqueueMock).toHaveBeenCalledWith(
        "sqs.queuee.url",
        { callbackUrl: "http://callback.com/examplee", provider: "gas" },
        300
      );
    });
  });
});
