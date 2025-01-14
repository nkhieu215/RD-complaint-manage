import dayjs from 'dayjs/esm';

export interface ICheckerList {
  id: number;
  name?: string | null;
  create_by?: string | null;
  created_at?: dayjs.Dayjs | null;
}

export type NewCheckerList = Omit<ICheckerList, 'id'> & { id: null };
