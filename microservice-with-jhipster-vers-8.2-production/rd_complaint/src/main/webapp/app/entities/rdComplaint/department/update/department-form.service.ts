import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDepartment, NewDepartment } from '../department.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDepartment for edit and NewDepartmentFormGroupInput for create.
 */
type DepartmentFormGroupInput = IDepartment | PartialWithRequiredKeyOf<NewDepartment>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDepartment | NewDepartment> = Omit<T, 'created_at'> & {
  created_at?: string | null;
};

type DepartmentFormRawValue = FormValueOf<IDepartment>;

type NewDepartmentFormRawValue = FormValueOf<NewDepartment>;

type DepartmentFormDefaults = Pick<NewDepartment, 'id' | 'created_at'>;

type DepartmentFormGroupContent = {
  id: FormControl<DepartmentFormRawValue['id'] | NewDepartment['id']>;
  name: FormControl<DepartmentFormRawValue['name']>;
  create_by: FormControl<DepartmentFormRawValue['create_by']>;
  created_at: FormControl<DepartmentFormRawValue['created_at']>;
  status: FormControl<DepartmentFormRawValue['status']>;
};

export type DepartmentFormGroup = FormGroup<DepartmentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DepartmentFormService {
  createDepartmentFormGroup(department: DepartmentFormGroupInput = { id: null }): DepartmentFormGroup {
    const departmentRawValue = this.convertDepartmentToDepartmentRawValue({
      ...this.getFormDefaults(),
      ...department,
    });
    return new FormGroup<DepartmentFormGroupContent>({
      id: new FormControl(
        { value: departmentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(departmentRawValue.name),
      create_by: new FormControl(departmentRawValue.create_by),
      created_at: new FormControl(departmentRawValue.created_at),
      status: new FormControl(departmentRawValue.status),
    });
  }

  getDepartment(form: DepartmentFormGroup): IDepartment | NewDepartment {
    return this.convertDepartmentRawValueToDepartment(form.getRawValue() as DepartmentFormRawValue | NewDepartmentFormRawValue);
  }

  resetForm(form: DepartmentFormGroup, department: DepartmentFormGroupInput): void {
    const departmentRawValue = this.convertDepartmentToDepartmentRawValue({ ...this.getFormDefaults(), ...department });
    form.reset(
      {
        ...departmentRawValue,
        id: { value: departmentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): DepartmentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      created_at: currentTime,
    };
  }

  private convertDepartmentRawValueToDepartment(
    rawDepartment: DepartmentFormRawValue | NewDepartmentFormRawValue,
  ): IDepartment | NewDepartment {
    return {
      ...rawDepartment,
      created_at: dayjs(rawDepartment.created_at, DATE_TIME_FORMAT),
    };
  }

  private convertDepartmentToDepartmentRawValue(
    department: IDepartment | (Partial<NewDepartment> & DepartmentFormDefaults),
  ): DepartmentFormRawValue | PartialWithRequiredKeyOf<NewDepartmentFormRawValue> {
    return {
      ...department,
      created_at: department.created_at ? department.created_at.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
