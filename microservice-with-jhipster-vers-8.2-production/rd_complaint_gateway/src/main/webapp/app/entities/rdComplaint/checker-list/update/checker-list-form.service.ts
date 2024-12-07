import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICheckerList, NewCheckerList } from '../checker-list.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICheckerList for edit and NewCheckerListFormGroupInput for create.
 */
type CheckerListFormGroupInput = ICheckerList | PartialWithRequiredKeyOf<NewCheckerList>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICheckerList | NewCheckerList> = Omit<T, 'created_at'> & {
  created_at?: string | null;
};

type CheckerListFormRawValue = FormValueOf<ICheckerList>;

type NewCheckerListFormRawValue = FormValueOf<NewCheckerList>;

type CheckerListFormDefaults = Pick<NewCheckerList, 'id' | 'created_at'>;

type CheckerListFormGroupContent = {
  id: FormControl<CheckerListFormRawValue['id'] | NewCheckerList['id']>;
  name: FormControl<CheckerListFormRawValue['name']>;
  create_by: FormControl<CheckerListFormRawValue['create_by']>;
  created_at: FormControl<CheckerListFormRawValue['created_at']>;
};

export type CheckerListFormGroup = FormGroup<CheckerListFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CheckerListFormService {
  createCheckerListFormGroup(checkerList: CheckerListFormGroupInput = { id: null }): CheckerListFormGroup {
    const checkerListRawValue = this.convertCheckerListToCheckerListRawValue({
      ...this.getFormDefaults(),
      ...checkerList,
    });
    return new FormGroup<CheckerListFormGroupContent>({
      id: new FormControl(
        { value: checkerListRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(checkerListRawValue.name),
      create_by: new FormControl(checkerListRawValue.create_by),
      created_at: new FormControl(checkerListRawValue.created_at),
    });
  }

  getCheckerList(form: CheckerListFormGroup): ICheckerList | NewCheckerList {
    return this.convertCheckerListRawValueToCheckerList(form.getRawValue() as CheckerListFormRawValue | NewCheckerListFormRawValue);
  }

  resetForm(form: CheckerListFormGroup, checkerList: CheckerListFormGroupInput): void {
    const checkerListRawValue = this.convertCheckerListToCheckerListRawValue({ ...this.getFormDefaults(), ...checkerList });
    form.reset(
      {
        ...checkerListRawValue,
        id: { value: checkerListRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CheckerListFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      created_at: currentTime,
    };
  }

  private convertCheckerListRawValueToCheckerList(
    rawCheckerList: CheckerListFormRawValue | NewCheckerListFormRawValue,
  ): ICheckerList | NewCheckerList {
    return {
      ...rawCheckerList,
      created_at: dayjs(rawCheckerList.created_at, DATE_TIME_FORMAT),
    };
  }

  private convertCheckerListToCheckerListRawValue(
    checkerList: ICheckerList | (Partial<NewCheckerList> & CheckerListFormDefaults),
  ): CheckerListFormRawValue | PartialWithRequiredKeyOf<NewCheckerListFormRawValue> {
    return {
      ...checkerList,
      created_at: checkerList.created_at ? checkerList.created_at.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
