import dayjs from 'dayjs/esm';

import { IListOfError, NewListOfError } from './list-of-error.model';

export const sampleWithRequiredData: IListOfError = {
  id: 24223,
};

export const sampleWithPartialData: IListOfError = {
  id: 25291,
  error_code: 'drat',
  error_name: 'apud coaxingly',
  error_source: 'those insubstantial',
  method: 'chubby',
  check_by_id: 14622,
  create_by: 'jail colonize',
  check_time: dayjs('2024-11-24T18:26'),
};

export const sampleWithFullData: IListOfError = {
  id: 13558,
  error_code: 'around aboard limited',
  error_name: 'ferociously',
  quantity: 16144,
  error_source: 'naturally',
  reason_id: 32035,
  method: 'indeed',
  check_by_id: 23001,
  create_by: 'during ugh',
  image: 'stun',
  created_at: dayjs('2024-11-25T02:48'),
  updated_at: dayjs('2024-11-24T19:07'),
  check_time: dayjs('2024-11-24T12:17'),
  complaint_id: 12046,
};

export const sampleWithNewData: NewListOfError = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
