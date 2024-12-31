import dayjs from 'dayjs/esm';

import { IComplaintList, NewComplaintList } from './complaint-list.model';

export const sampleWithRequiredData: IComplaintList = {
  id: 22198,
};

export const sampleWithPartialData: IComplaintList = {
  id: 27560,
  product_code: 'clogs',
  branch: 'via by',
  reflector_id: 29643,
  total_errors: 18763,
  production_time: dayjs('2024-11-24T18:16'),
  dapartment_id: 31699,
  status: 'than expression',
  comment: 'surprise without meh',
  complaint_id: 5793,
  updated_at: dayjs('2024-11-24T19:36'),
};

export const sampleWithFullData: IComplaintList = {
  id: 32552,
  product_code: 'until',
  product_name: 'blah since till',
  lot_number: 'towards mid',
  branch: 'pillory',
  reflector_id: 32535,
  total_errors: 29272,
  quantity: 11326,
  production_time: dayjs('2024-11-24T11:19'),
  dapartment_id: 4084,
  check_by_id: 28168,
  rectification_time: dayjs('2024-11-24T20:33'),
  create_by: 'fellow through',
  status: 'spirited',
  complaint_detail: 'phooey',
  unit_of_use: '4831',
  implementation_result_id: 30331,
  comment: 'um betake',
  follow_up_comment: 'zowie wherever',
  complaint_id: 31444,
  created_at: dayjs('2024-11-25T00:23'),
  updated_at: dayjs('2024-11-24T15:11'),
  serial: 'wherever and silver',
  mac_address: 'upside-down woeful',
};

export const sampleWithNewData: NewComplaintList = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
