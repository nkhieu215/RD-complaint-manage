import dayjs from 'dayjs/esm';

import { IUnitOfUse, NewUnitOfUse } from './unit-of-use.model';

export const sampleWithRequiredData: IUnitOfUse = {
  id: 30277,
};

export const sampleWithPartialData: IUnitOfUse = {
  id: 18317,
  name: 'playfully',
  created_at: dayjs('2024-11-25T00:00'),
};

export const sampleWithFullData: IUnitOfUse = {
  id: 10969,
  name: 'fabricate neigh gaseous',
  create_by: 'agreeable',
  created_at: dayjs('2024-11-24T21:50'),
};

export const sampleWithNewData: NewUnitOfUse = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
