export interface IBillsCallbackPayload {
    provider: 'gas' | 'internet';
    callbackUrl: string;
}