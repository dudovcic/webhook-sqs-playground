import { UnauthTypedRequest } from '../../middleware/request-middleware';
import { IServices } from '../../services';
import { validateBillsPayload } from '../utils/bills-utils';
import { badRequest, internal } from '../../errors/error-response';
import { IBillsCallbackPayload } from './types/requests';
import { IApiResponse } from '../../types/response';

export default class BillsController {
  constructor(
    protected config: config.IConfig,
    protected services: IServices
  ) {}

  public handleBillsWebhookSubscription = async (
    req: UnauthTypedRequest<void, IBillsCallbackPayload, void>
  ): IApiResponse<{ success: boolean; }> => {
    const payload = req.body;

    const validationErrors = validateBillsPayload(payload);
    if (validationErrors.length) {
      return badRequest('ValidationError', validationErrors);
    }

    try {
      await this.services.sqs.enqueueSQSMessage('https://sqs.eu-west-2.amazonaws.com/334964088068/bills-queue',{
        provider: payload.provider,
        callbackUrl: payload.callbackUrl,
      });
    } catch (e) {
      return internal('Internal error')
    }

    return {
      success: true,
    };
  };
}
