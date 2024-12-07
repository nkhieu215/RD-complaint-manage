import dayjs from 'dayjs/esm';

export interface IComplaint {
  id: number;
  name?: string | null;
  create_by?: string | null;
  created_at?: dayjs.Dayjs | null;
  status?: string | null;
}

export type NewComplaint = Omit<IComplaint, 'id'> & { id: null };
