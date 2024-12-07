import dayjs from 'dayjs/esm';

export interface IComplaintStatus {
  id: number;
  name?: string | null;
  create_by?: string | null;
  created_at?: dayjs.Dayjs | null;
}

export type NewComplaintStatus = Omit<IComplaintStatus, 'id'> & { id: null };
