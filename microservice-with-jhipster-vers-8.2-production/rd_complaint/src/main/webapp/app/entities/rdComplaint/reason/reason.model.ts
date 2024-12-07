import dayjs from 'dayjs/esm';

export interface IReason {
  id: number;
  name?: string | null;
  create_by?: string | null;
  created_at?: dayjs.Dayjs | null;
  status?: string | null;
}

export type NewReason = Omit<IReason, 'id'> & { id: null };
