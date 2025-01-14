import dayjs from 'dayjs/esm';

export interface IUnitOfUse {
  id: number;
  name?: string | null;
  create_by?: string | null;
  created_at?: dayjs.Dayjs | null;
}

export type NewUnitOfUse = Omit<IUnitOfUse, 'id'> & { id: null };
