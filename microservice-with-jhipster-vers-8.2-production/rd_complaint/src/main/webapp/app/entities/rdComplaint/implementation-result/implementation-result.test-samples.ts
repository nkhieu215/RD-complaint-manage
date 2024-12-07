import dayjs from 'dayjs/esm';

import { IImplementationResult, NewImplementationResult } from './implementation-result.model';

export const sampleWithRequiredData: IImplementationResult = {
  id: 15729,
};

export const sampleWithPartialData: IImplementationResult = {
  id: 29211,
  created_at: dayjs('2024-11-24T08:33'),
  status: 'zowie',
};

export const sampleWithFullData: IImplementationResult = {
  id: 15955,
  name: 'well',
  create_by: 'who eventually before',
  created_at: dayjs('2024-11-25T01:16'),
  status: 'nifty',
};

export const sampleWithNewData: NewImplementationResult = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
