import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IComplaint, NewComplaint } from '../complaint.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IComplaint for edit and NewComplaintFormGroupInput for create.
 */
type ComplaintFormGroupInput = IComplaint | PartialWithRequiredKeyOf<NewComplaint>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IComplaint | NewComplaint> = Omit<T, 'created_at'> & {
  created_at?: string | null;
};

type ComplaintFormRawValue = FormValueOf<IComplaint>;

type NewComplaintFormRawValue = FormValueOf<NewComplaint>;

type ComplaintFormDefaults = Pick<NewComplaint, 'id' | 'created_at'>;

type ComplaintFormGroupContent = {
  id: FormControl<ComplaintFormRawValue['id'] | NewComplaint['id']>;
  name: FormControl<ComplaintFormRawValue['name']>;
  create_by: FormControl<ComplaintFormRawValue['create_by']>;
  created_at: FormControl<ComplaintFormRawValue['created_at']>;
  status: FormControl<ComplaintFormRawValue['status']>;
};

export type ComplaintFormGroup = FormGroup<ComplaintFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ComplaintFormService {
  createComplaintFormGroup(complaint: ComplaintFormGroupInput = { id: null }): ComplaintFormGroup {
    const complaintRawValue = this.convertComplaintToComplaintRawValue({
      ...this.getFormDefaults(),
      ...complaint,
    });
    return new FormGroup<ComplaintFormGroupContent>({
      id: new FormControl(
        { value: complaintRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(complaintRawValue.name),
      create_by: new FormControl(complaintRawValue.create_by),
      created_at: new FormControl(complaintRawValue.created_at),
      status: new FormControl(complaintRawValue.status),
    });
  }

  getComplaint(form: ComplaintFormGroup): IComplaint | NewComplaint {
    return this.convertComplaintRawValueToComplaint(form.getRawValue() as ComplaintFormRawValue | NewComplaintFormRawValue);
  }

  resetForm(form: ComplaintFormGroup, complaint: ComplaintFormGroupInput): void {
    const complaintRawValue = this.convertComplaintToComplaintRawValue({ ...this.getFormDefaults(), ...complaint });
    form.reset(
      {
        ...complaintRawValue,
        id: { value: complaintRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ComplaintFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      created_at: currentTime,
    };
  }

  private convertComplaintRawValueToComplaint(rawComplaint: ComplaintFormRawValue | NewComplaintFormRawValue): IComplaint | NewComplaint {
    return {
      ...rawComplaint,
      created_at: dayjs(rawComplaint.created_at, DATE_TIME_FORMAT),
    };
  }

  private convertComplaintToComplaintRawValue(
    complaint: IComplaint | (Partial<NewComplaint> & ComplaintFormDefaults),
  ): ComplaintFormRawValue | PartialWithRequiredKeyOf<NewComplaintFormRawValue> {
    return {
      ...complaint,
      created_at: complaint.created_at ? complaint.created_at.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
