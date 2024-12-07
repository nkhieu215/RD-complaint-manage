import dayjs from 'dayjs/esm';

import { IUnitOfUse, NewUnitOfUse } from './unit-of-use.model';

export const sampleWithRequiredData: IUnitOfUse = {
  id: 1549,
};

export const sampleWithPartialData: IUnitOfUse = {
  id: 19893,
  create_by: 'upon',
  created_at: dayjs('2024-11-24T12:50'),
};

export const sampleWithFullData: IUnitOfUse = {
  id: 14711,
  name: 'decentralise embarrassed',
  create_by: 'fooey',
  created_at: dayjs('2024-11-24T09:41'),
};

export const sampleWithNewData: NewUnitOfUse = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
