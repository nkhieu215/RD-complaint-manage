import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IReason, NewReason } from '../reason.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReason for edit and NewReasonFormGroupInput for create.
 */
type ReasonFormGroupInput = IReason | PartialWithRequiredKeyOf<NewReason>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IReason | NewReason> = Omit<T, 'created_at'> & {
  created_at?: string | null;
};

type ReasonFormRawValue = FormValueOf<IReason>;

type NewReasonFormRawValue = FormValueOf<NewReason>;

type ReasonFormDefaults = Pick<NewReason, 'id' | 'created_at'>;

type ReasonFormGroupContent = {
  id: FormControl<ReasonFormRawValue['id'] | NewReason['id']>;
  name: FormControl<ReasonFormRawValue['name']>;
  create_by: FormControl<ReasonFormRawValue['create_by']>;
  created_at: FormControl<ReasonFormRawValue['created_at']>;
  status: FormControl<ReasonFormRawValue['status']>;
};

export type ReasonFormGroup = FormGroup<ReasonFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReasonFormService {
  createReasonFormGroup(reason: ReasonFormGroupInput = { id: null }): ReasonFormGroup {
    const reasonRawValue = this.convertReasonToReasonRawValue({
      ...this.getFormDefaults(),
      ...reason,
    });
    return new FormGroup<ReasonFormGroupContent>({
      id: new FormControl(
        { value: reasonRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(reasonRawValue.name),
      create_by: new FormControl(reasonRawValue.create_by),
      created_at: new FormControl(reasonRawValue.created_at),
      status: new FormControl(reasonRawValue.status),
    });
  }

  getReason(form: ReasonFormGroup): IReason | NewReason {
    return this.convertReasonRawValueToReason(form.getRawValue() as ReasonFormRawValue | NewReasonFormRawValue);
  }

  resetForm(form: ReasonFormGroup, reason: ReasonFormGroupInput): void {
    const reasonRawValue = this.convertReasonToReasonRawValue({ ...this.getFormDefaults(), ...reason });
    form.reset(
      {
        ...reasonRawValue,
        id: { value: reasonRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ReasonFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      created_at: currentTime,
    };
  }

  private convertReasonRawValueToReason(rawReason: ReasonFormRawValue | NewReasonFormRawValue): IReason | NewReason {
    return {
      ...rawReason,
      created_at: dayjs(rawReason.created_at, DATE_TIME_FORMAT),
    };
  }

  private convertReasonToReasonRawValue(
    reason: IReason | (Partial<NewReason> & ReasonFormDefaults),
  ): ReasonFormRawValue | PartialWithRequiredKeyOf<NewReasonFormRawValue> {
    return {
      ...reason,
      created_at: reason.created_at ? reason.created_at.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
