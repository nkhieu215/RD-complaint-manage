import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IComplaintStatus, NewComplaintStatus } from '../complaint-status.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IComplaintStatus for edit and NewComplaintStatusFormGroupInput for create.
 */
type ComplaintStatusFormGroupInput = IComplaintStatus | PartialWithRequiredKeyOf<NewComplaintStatus>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IComplaintStatus | NewComplaintStatus> = Omit<T, 'created_at'> & {
  created_at?: string | null;
};

type ComplaintStatusFormRawValue = FormValueOf<IComplaintStatus>;

type NewComplaintStatusFormRawValue = FormValueOf<NewComplaintStatus>;

type ComplaintStatusFormDefaults = Pick<NewComplaintStatus, 'id' | 'created_at'>;

type ComplaintStatusFormGroupContent = {
  id: FormControl<ComplaintStatusFormRawValue['id'] | NewComplaintStatus['id']>;
  name: FormControl<ComplaintStatusFormRawValue['name']>;
  create_by: FormControl<ComplaintStatusFormRawValue['create_by']>;
  created_at: FormControl<ComplaintStatusFormRawValue['created_at']>;
};

export type ComplaintStatusFormGroup = FormGroup<ComplaintStatusFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ComplaintStatusFormService {
  createComplaintStatusFormGroup(complaintStatus: ComplaintStatusFormGroupInput = { id: null }): ComplaintStatusFormGroup {
    const complaintStatusRawValue = this.convertComplaintStatusToComplaintStatusRawValue({
      ...this.getFormDefaults(),
      ...complaintStatus,
    });
    return new FormGroup<ComplaintStatusFormGroupContent>({
      id: new FormControl(
        { value: complaintStatusRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(complaintStatusRawValue.name),
      create_by: new FormControl(complaintStatusRawValue.create_by),
      created_at: new FormControl(complaintStatusRawValue.created_at),
    });
  }

  getComplaintStatus(form: ComplaintStatusFormGroup): IComplaintStatus | NewComplaintStatus {
    return this.convertComplaintStatusRawValueToComplaintStatus(
      form.getRawValue() as ComplaintStatusFormRawValue | NewComplaintStatusFormRawValue,
    );
  }

  resetForm(form: ComplaintStatusFormGroup, complaintStatus: ComplaintStatusFormGroupInput): void {
    const complaintStatusRawValue = this.convertComplaintStatusToComplaintStatusRawValue({ ...this.getFormDefaults(), ...complaintStatus });
    form.reset(
      {
        ...complaintStatusRawValue,
        id: { value: complaintStatusRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ComplaintStatusFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      created_at: currentTime,
    };
  }

  private convertComplaintStatusRawValueToComplaintStatus(
    rawComplaintStatus: ComplaintStatusFormRawValue | NewComplaintStatusFormRawValue,
  ): IComplaintStatus | NewComplaintStatus {
    return {
      ...rawComplaintStatus,
      created_at: dayjs(rawComplaintStatus.created_at, DATE_TIME_FORMAT),
    };
  }

  private convertComplaintStatusToComplaintStatusRawValue(
    complaintStatus: IComplaintStatus | (Partial<NewComplaintStatus> & ComplaintStatusFormDefaults),
  ): ComplaintStatusFormRawValue | PartialWithRequiredKeyOf<NewComplaintStatusFormRawValue> {
    return {
      ...complaintStatus,
      created_at: complaintStatus.created_at ? complaintStatus.created_at.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
