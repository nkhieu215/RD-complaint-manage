import dayjs from 'dayjs/esm';

import { IComplaint, NewComplaint } from './complaint.model';

export const sampleWithRequiredData: IComplaint = {
  id: 162,
};

export const sampleWithPartialData: IComplaint = {
  id: 8693,
  create_by: 'utterly',
  created_at: dayjs('2024-11-24T22:59'),
};

export const sampleWithFullData: IComplaint = {
  id: 17549,
  name: 'unselfish seemingly',
  create_by: 'wetland',
  created_at: dayjs('2024-11-24T20:12'),
  status: 'coaxingly sometimes delectable',
};

export const sampleWithNewData: NewComplaint = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
