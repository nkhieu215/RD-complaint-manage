import dayjs from 'dayjs/esm';

import { IComplaintStatus, NewComplaintStatus } from './complaint-status.model';

export const sampleWithRequiredData: IComplaintStatus = {
  id: 5028,
};

export const sampleWithPartialData: IComplaintStatus = {
  id: 26250,
  name: 'poised rabbit grand',
};

export const sampleWithFullData: IComplaintStatus = {
  id: 13760,
  name: 'woot whenever',
  create_by: 'knife-edge celebrated',
  created_at: dayjs('2024-11-24T17:19'),
};

export const sampleWithNewData: NewComplaintStatus = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
