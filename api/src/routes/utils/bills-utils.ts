import { IBillsCallbackPayload } from '../bills/types.ts/requests';


export const validateBillsPayload = (
  payload: IBillsCallbackPayload
): string[] => {
  const errors: string[] = [];
  if (!['gas', 'internet'].includes(payload.provider)) {
    errors.push('Invalid provider');
    return errors;
  }

  if (typeof payload.callbackUrl !== 'string') {
    errors.push(
      'Invalid callback url'
    );
  }
  return errors;
};
