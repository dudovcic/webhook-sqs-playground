import BillsController from "./bills.controller";
import config from "../../config/index";
import { IBillsCallbackPayload } from "./types/requests";

describe("controllers/bills.controller", () => {
  let billsController: BillsController;
  const enqueueSQSSpy = jest.fn();
  beforeEach(() => {
    const servicesMock = {
      sqs: {
        enqueueSQSMessage: enqueueSQSSpy,
      } as any,
    };
    billsController = new BillsController(config, servicesMock);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should validate bills webhook request", async () => {
    let result = await billsController.handleBillsWebhookSubscription({
      body: {
        provider: "UNKNOWN",
        callbackUrl: "http://callbback.com/callback",
      },
    } as any);

    expect(result).toEqual({
      reason: "ValidationError",
      statusCode: 400,
      validationErrors: ["Invalid provider"],
    });

    result = await billsController.handleBillsWebhookSubscription({
      body: {
        provider: "gas",
        callbackUrl: undefined,
      },
    } as any);

    expect(result).toEqual({
      reason: "ValidationError",
      statusCode: 400,
      validationErrors: ["Invalid callback url"],
    });
  });

  it("should successfully enqueue payload for bills webhook request", async () => {
    const body: IBillsCallbackPayload = {
      provider: "gas",
      callbackUrl: "http://callbback.com/callback",
    };

    const result = await billsController.handleBillsWebhookSubscription({
      body,
    } as any);

    expect(enqueueSQSSpy).toHaveBeenCalledWith(
      "https://sqs.eu-west-2.amazonaws.com/334964088068/bills-queue",
      body,
    );

    expect(result).toEqual({
        success: true,
    });
  });
});
