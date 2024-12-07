import dayjs from 'dayjs/esm';

import { ICheckerList, NewCheckerList } from './checker-list.model';

export const sampleWithRequiredData: ICheckerList = {
  id: 24636,
};

export const sampleWithPartialData: ICheckerList = {
  id: 15531,
};

export const sampleWithFullData: ICheckerList = {
  id: 17699,
  name: 'jealously descriptive inquisitively',
  create_by: 'how private',
  created_at: dayjs('2024-11-25T06:24'),
};

export const sampleWithNewData: NewCheckerList = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
