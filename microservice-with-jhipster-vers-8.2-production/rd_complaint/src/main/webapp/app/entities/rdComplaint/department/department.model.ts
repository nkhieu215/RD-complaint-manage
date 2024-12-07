import dayjs from 'dayjs/esm';

export interface IDepartment {
  id: number;
  name?: string | null;
  create_by?: string | null;
  created_at?: dayjs.Dayjs | null;
  status?: string | null;
}

export type NewDepartment = Omit<IDepartment, 'id'> & { id: null };
