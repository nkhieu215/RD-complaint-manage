import dayjs from 'dayjs/esm';

export interface IImplementationResult {
  id: number;
  name?: string | null;
  create_by?: string | null;
  created_at?: dayjs.Dayjs | null;
  status?: string | null;
}

export type NewImplementationResult = Omit<IImplementationResult, 'id'> & { id: null };
