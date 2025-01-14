import dayjs from 'dayjs/esm';

import { IDepartment, NewDepartment } from './department.model';

export const sampleWithRequiredData: IDepartment = {
  id: 6858,
};

export const sampleWithPartialData: IDepartment = {
  id: 26458,
  name: 'eek subconscious gadzooks',
  created_at: dayjs('2024-11-24T10:20'),
};

export const sampleWithFullData: IDepartment = {
  id: 308,
  name: 'finally',
  create_by: 'sans or',
  created_at: dayjs('2024-11-25T04:29'),
  status: 'across apud',
};

export const sampleWithNewData: NewDepartment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
