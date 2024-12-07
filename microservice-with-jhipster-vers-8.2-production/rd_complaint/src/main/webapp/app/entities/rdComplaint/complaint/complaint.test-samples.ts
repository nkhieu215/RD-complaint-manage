import dayjs from 'dayjs/esm';

import { IComplaint, NewComplaint } from './complaint.model';

export const sampleWithRequiredData: IComplaint = {
  id: 784,
};

export const sampleWithPartialData: IComplaint = {
  id: 25286,
  name: 'badly presuppose lest',
};

export const sampleWithFullData: IComplaint = {
  id: 26524,
  name: 'or ah gosh',
  create_by: 'bah',
  created_at: dayjs('2024-11-24T13:09'),
  status: 'potential',
};

export const sampleWithNewData: NewComplaint = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
