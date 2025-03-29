import got from 'got';

import { OffersSourceData, UsersValues, OffersValues } from '../../types/index.js';
import { DataLoader } from './data-loader.interface.js';
import { OffersSourceDataPath } from './offers-source-data-path.enum.js';

export class OffersSourceDataLoader implements DataLoader<OffersSourceData> {
  public async load(url: string): Promise<OffersSourceData> | never {
    const [usersValues, offersValues] = await Promise.all([
      got.get(`${url}${OffersSourceDataPath.Users}`).json<UsersValues>(),
      got.get(`${url}${OffersSourceDataPath.Offers}`).json<OffersValues>()
    ]);

    return { usersValues, offersValues };
  }
}
