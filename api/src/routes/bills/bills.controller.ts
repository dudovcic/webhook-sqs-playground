import { UnauthTypedRequest } from '../../middleware/request-middleware';
import { IServices } from '../../services';
import { validateBillsPayload } from '../utils/bills-utils';
import { badRequest, internal } from '../../errors/error-response';
import { IBillsCallbackPayload } from './types.ts/requests';
import { IApiResponse } from '../../types/response';

export default class BillsController {
  constructor(
    protected config: config.IConfig,
    protected services: IServices
  ) {}

  public handleBillsWebhookSubscription = async (
    req: UnauthTypedRequest<void, IBillsCallbackPayload, void>
  ): IApiResponse<string> => {
    const payload = req.body;

    const validationErrors = validateBillsPayload(payload);
    if (validationErrors.length) {
      return badRequest('ValidationError', validationErrors);
    }

    const results = await this.services.bills.getProviderData(payload.provider);

    if (results) {
      return results;
    }

    return internal('Something went wrong');
  };
}
