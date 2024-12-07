import dayjs from 'dayjs/esm';

export interface IComplaintList {
  id: number;
  product_code?: string | null;
  product_name?: string | null;
  lot_number?: string | null;
  branch?: string | null;
  reflector_id?: number | null;
  total_errors?: number | null;
  quantity?: number | null;
  production_time?: dayjs.Dayjs | null;
  dapartment_id?: number | null;
  check_by_id?: number | null;
  rectification_time?: dayjs.Dayjs | null;
  create_by?: string | null;
  status?: string | null;
  complaint_detail?: string | null;
  unit_of_use_id?: number | null;
  implementation_result_id?: number | null;
  comment?: string | null;
  follow_up_comment?: string | null;
  complaint_id?: number | null;
  created_at?: dayjs.Dayjs | null;
  updated_at?: dayjs.Dayjs | null;
  serial?: string | null;
  mac_address?: string | null;
}

export type NewComplaintList = Omit<IComplaintList, 'id'> & { id: null };
