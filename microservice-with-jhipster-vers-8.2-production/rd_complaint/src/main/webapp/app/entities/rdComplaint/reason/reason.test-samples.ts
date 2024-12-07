import dayjs from 'dayjs/esm';

import { IReason, NewReason } from './reason.model';

export const sampleWithRequiredData: IReason = {
  id: 3409,
};

export const sampleWithPartialData: IReason = {
  id: 11956,
  name: 'abaft swiftly',
};

export const sampleWithFullData: IReason = {
  id: 16571,
  name: 'sleepy intently',
  create_by: 'phooey',
  created_at: dayjs('2024-11-24T17:53'),
  status: 'toast fisherman worried',
};

export const sampleWithNewData: NewReason = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
