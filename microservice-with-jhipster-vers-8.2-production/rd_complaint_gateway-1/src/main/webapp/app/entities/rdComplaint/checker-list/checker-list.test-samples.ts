import dayjs from 'dayjs/esm';

import { ICheckerList, NewCheckerList } from './checker-list.model';

export const sampleWithRequiredData: ICheckerList = {
  id: 16271,
};

export const sampleWithPartialData: ICheckerList = {
  id: 19288,
  created_at: dayjs('2024-11-24T08:19'),
};

export const sampleWithFullData: ICheckerList = {
  id: 10517,
  name: 'ouch from smile',
  create_by: 'if tourist impish',
  created_at: dayjs('2024-11-24T13:34'),
};

export const sampleWithNewData: NewCheckerList = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
