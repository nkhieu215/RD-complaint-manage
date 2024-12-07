import dayjs from 'dayjs/esm';

export interface IListOfError {
  id: number;
  error_code?: string | null;
  error_name?: string | null;
  quantity?: number | null;
  error_source?: string | null;
  reason_id?: number | null;
  method?: string | null;
  check_by_id?: number | null;
  create_by?: string | null;
  image?: string | null;
  created_at?: dayjs.Dayjs | null;
  updated_at?: dayjs.Dayjs | null;
  check_time?: dayjs.Dayjs | null;
  complaint_id?: number | null;
}

export type NewListOfError = Omit<IListOfError, 'id'> & { id: null };
