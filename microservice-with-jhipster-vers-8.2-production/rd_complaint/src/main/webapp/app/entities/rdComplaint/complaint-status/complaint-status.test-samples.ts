import dayjs from 'dayjs/esm';

import { IComplaintStatus, NewComplaintStatus } from './complaint-status.model';

export const sampleWithRequiredData: IComplaintStatus = {
  id: 26130,
};

export const sampleWithPartialData: IComplaintStatus = {
  id: 11146,
  create_by: 'dissemble ashamed',
  created_at: dayjs('2024-11-24T08:25'),
};

export const sampleWithFullData: IComplaintStatus = {
  id: 8842,
  name: 'frisk veil um',
  create_by: 'properly yawningly procurement',
  created_at: dayjs('2024-11-24T15:09'),
};

export const sampleWithNewData: NewComplaintStatus = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
