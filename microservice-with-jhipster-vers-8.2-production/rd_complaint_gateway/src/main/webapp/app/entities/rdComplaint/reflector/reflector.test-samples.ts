import dayjs from 'dayjs/esm';

import { IReflector, NewReflector } from './reflector.model';

export const sampleWithRequiredData: IReflector = {
  id: 5392,
};

export const sampleWithPartialData: IReflector = {
  id: 14512,
  create_by: 'without',
  created_at: dayjs('2024-11-25T04:14'),
};

export const sampleWithFullData: IReflector = {
  id: 8404,
  name: 'holler probable',
  create_by: 'ack hasty yahoo',
  created_at: dayjs('2024-11-25T01:31'),
};

export const sampleWithNewData: NewReflector = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
