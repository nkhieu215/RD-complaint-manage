import dayjs from 'dayjs/esm';

import { IReflector, NewReflector } from './reflector.model';

export const sampleWithRequiredData: IReflector = {
  id: 29726,
};

export const sampleWithPartialData: IReflector = {
  id: 18794,
  name: 'cofactor knavishly socialist',
  create_by: 'and',
  created_at: dayjs('2024-11-24T09:44'),
};

export const sampleWithFullData: IReflector = {
  id: 13687,
  name: 'kiddingly',
  create_by: 'jubilantly eek idle',
  created_at: dayjs('2024-11-24T08:24'),
};

export const sampleWithNewData: NewReflector = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
