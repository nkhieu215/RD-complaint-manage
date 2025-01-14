import dayjs from 'dayjs/esm';

import { IReason, NewReason } from './reason.model';

export const sampleWithRequiredData: IReason = {
  id: 19954,
};

export const sampleWithPartialData: IReason = {
  id: 2415,
  create_by: 'fearful abnormally',
  created_at: dayjs('2024-11-24T18:06'),
  status: 'about local slake',
};

export const sampleWithFullData: IReason = {
  id: 26476,
  name: 'economy',
  create_by: 'giving awful bah',
  created_at: dayjs('2024-11-24T19:20'),
  status: 'double rear',
};

export const sampleWithNewData: NewReason = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
