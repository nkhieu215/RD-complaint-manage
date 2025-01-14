import dayjs from 'dayjs/esm';

export interface IReflector {
  id: number;
  name?: string | null;
  create_by?: string | null;
  created_at?: dayjs.Dayjs | null;
}

export type NewReflector = Omit<IReflector, 'id'> & { id: null };
