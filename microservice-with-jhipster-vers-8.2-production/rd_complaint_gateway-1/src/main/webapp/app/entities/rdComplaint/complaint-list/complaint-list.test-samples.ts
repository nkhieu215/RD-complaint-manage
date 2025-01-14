import dayjs from 'dayjs/esm';

import { IComplaintList, NewComplaintList } from './complaint-list.model';

export const sampleWithRequiredData: IComplaintList = {
  id: 10460,
};

export const sampleWithPartialData: IComplaintList = {
  id: 6805,
  product_code: 'gargantuan',
  lot_number: 'ply abaft',
  total_errors: 13429,
  production_time: dayjs('2024-11-24T14:39'),
  follow_up_comment: 'even frosty',
  complaint_id: 24142,
};

export const sampleWithFullData: IComplaintList = {
  id: 31527,
  product_code: 'rear although',
  product_name: 'yawningly qua',
  lot_number: 'pish clean phooey',
  branch: 'expectation ick once',
  reflector_id: 19901,
  total_errors: 24177,
  quantity: 24661,
  production_time: dayjs('2024-11-24T10:36'),
  dapartment_id: 16880,
  check_by_id: 24854,
  rectification_time: dayjs('2024-11-25T04:07'),
  create_by: 'gee psst',
  status: 'ill-fated chunder',
  complaint_detail: 'smooth catalyse',
  unit_of_use: '10236',
  implementation_result_id: 31724,
  comment: 'estimate wilderness softly',
  follow_up_comment: 'amazing',
  complaint_id: 29176,
  created_at: dayjs('2024-11-24T15:33'),
  updated_at: dayjs('2024-11-24T15:23'),
  serial: 'into consequently',
  mac_address: 'um',
};

export const sampleWithNewData: NewComplaintList = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
