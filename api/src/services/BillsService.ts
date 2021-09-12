import Axios, { AxiosInstance, AxiosResponse } from 'axios';

export class BillsService {
  private axiosClient: AxiosInstance;

  constructor(config: config.IConfig) {
    this.axiosClient = Axios.create({
      baseURL: config.billsServerUrl,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  public getProviderData = async (
    provider: 'gas' | 'internet',
  ): Promise<string> => {
    const result = await this.axiosClient.get<
      never,
      AxiosResponse<any>
    >(`/providers/${provider}`);

    // TODO?: Ideally return more info if at least 400
    if (['4', '5'].includes(result.status.toString()[0])) {
      throw new Error('Error getting provider data');
    }

    return result && result.data;
  };
}
