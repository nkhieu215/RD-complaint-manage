import dayjs from 'dayjs/esm';

import { IListOfError, NewListOfError } from './list-of-error.model';

export const sampleWithRequiredData: IListOfError = {
  id: 21180,
};

export const sampleWithPartialData: IListOfError = {
  id: 31498,
  error_source: 'zowie versus secularize',
  check_by_id: 21542,
  image: 'animated for',
  created_at: dayjs('2024-11-25T06:17'),
  check_time: dayjs('2024-11-24T17:19'),
  complaint_id: 13968,
};

export const sampleWithFullData: IListOfError = {
  id: 29828,
  error_code: 'abnormally',
  error_name: 'amidst so gadzooks',
  quantity: 28790,
  error_source: 'obtain',
  reason_id: 23309,
  method: 'lobby psych though',
  check_by_id: 2524,
  create_by: 'zing',
  image: 'on',
  created_at: dayjs('2024-11-24T22:06'),
  updated_at: dayjs('2024-11-24T20:05'),
  check_time: dayjs('2024-11-25T03:37'),
  complaint_id: 13125,
};

export const sampleWithNewData: NewListOfError = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
