import dayjs from 'dayjs/esm';

import { IDepartment, NewDepartment } from './department.model';

export const sampleWithRequiredData: IDepartment = {
  id: 13960,
};

export const sampleWithPartialData: IDepartment = {
  id: 8852,
};

export const sampleWithFullData: IDepartment = {
  id: 25644,
  name: 'mollify sweeten blah',
  create_by: 'who dearest',
  created_at: dayjs('2024-11-24T17:34'),
  status: 'aware',
};

export const sampleWithNewData: NewDepartment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
