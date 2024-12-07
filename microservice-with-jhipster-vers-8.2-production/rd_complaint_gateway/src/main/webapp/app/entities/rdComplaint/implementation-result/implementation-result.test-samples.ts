import dayjs from 'dayjs/esm';

import { IImplementationResult, NewImplementationResult } from './implementation-result.model';

export const sampleWithRequiredData: IImplementationResult = {
  id: 17331,
};

export const sampleWithPartialData: IImplementationResult = {
  id: 11932,
  name: 'likewise unlike',
  created_at: dayjs('2024-11-24T07:49'),
};

export const sampleWithFullData: IImplementationResult = {
  id: 30827,
  name: 'injury cinnamon nourish',
  create_by: 'frigid mix',
  created_at: dayjs('2024-11-24T15:52'),
  status: 'combat a elevate',
};

export const sampleWithNewData: NewImplementationResult = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
