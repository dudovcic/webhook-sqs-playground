import { BillsService } from './BillsService';

export interface IServices {
  bills: BillsService;
}

export const createServices = (config: config.IConfig): IServices => {
  return {
    bills: new BillsService(config)
  };
};
