import { SQSService } from './SQSService';
import * as AWS from 'aws-sdk';

export interface IServices {
  sqs: SQSService;
}

export const createServices = (_config: config.IConfig): IServices => {
  return {
    sqs: new SQSService(new AWS.SQS({ region: 'eu-west-2'}))
  };
};
