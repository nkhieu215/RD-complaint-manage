import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUnitOfUse, NewUnitOfUse } from '../unit-of-use.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUnitOfUse for edit and NewUnitOfUseFormGroupInput for create.
 */
type UnitOfUseFormGroupInput = IUnitOfUse | PartialWithRequiredKeyOf<NewUnitOfUse>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IUnitOfUse | NewUnitOfUse> = Omit<T, 'created_at'> & {
  created_at?: string | null;
};

type UnitOfUseFormRawValue = FormValueOf<IUnitOfUse>;

type NewUnitOfUseFormRawValue = FormValueOf<NewUnitOfUse>;

type UnitOfUseFormDefaults = Pick<NewUnitOfUse, 'id' | 'created_at'>;

type UnitOfUseFormGroupContent = {
  id: FormControl<UnitOfUseFormRawValue['id'] | NewUnitOfUse['id']>;
  name: FormControl<UnitOfUseFormRawValue['name']>;
  create_by: FormControl<UnitOfUseFormRawValue['create_by']>;
  created_at: FormControl<UnitOfUseFormRawValue['created_at']>;
};

export type UnitOfUseFormGroup = FormGroup<UnitOfUseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UnitOfUseFormService {
  createUnitOfUseFormGroup(unitOfUse: UnitOfUseFormGroupInput = { id: null }): UnitOfUseFormGroup {
    const unitOfUseRawValue = this.convertUnitOfUseToUnitOfUseRawValue({
      ...this.getFormDefaults(),
      ...unitOfUse,
    });
    return new FormGroup<UnitOfUseFormGroupContent>({
      id: new FormControl(
        { value: unitOfUseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(unitOfUseRawValue.name),
      create_by: new FormControl(unitOfUseRawValue.create_by),
      created_at: new FormControl(unitOfUseRawValue.created_at),
    });
  }

  getUnitOfUse(form: UnitOfUseFormGroup): IUnitOfUse | NewUnitOfUse {
    return this.convertUnitOfUseRawValueToUnitOfUse(form.getRawValue() as UnitOfUseFormRawValue | NewUnitOfUseFormRawValue);
  }

  resetForm(form: UnitOfUseFormGroup, unitOfUse: UnitOfUseFormGroupInput): void {
    const unitOfUseRawValue = this.convertUnitOfUseToUnitOfUseRawValue({ ...this.getFormDefaults(), ...unitOfUse });
    form.reset(
      {
        ...unitOfUseRawValue,
        id: { value: unitOfUseRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): UnitOfUseFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      created_at: currentTime,
    };
  }

  private convertUnitOfUseRawValueToUnitOfUse(rawUnitOfUse: UnitOfUseFormRawValue | NewUnitOfUseFormRawValue): IUnitOfUse | NewUnitOfUse {
    return {
      ...rawUnitOfUse,
      created_at: dayjs(rawUnitOfUse.created_at, DATE_TIME_FORMAT),
    };
  }

  private convertUnitOfUseToUnitOfUseRawValue(
    unitOfUse: IUnitOfUse | (Partial<NewUnitOfUse> & UnitOfUseFormDefaults),
  ): UnitOfUseFormRawValue | PartialWithRequiredKeyOf<NewUnitOfUseFormRawValue> {
    return {
      ...unitOfUse,
      created_at: unitOfUse.created_at ? unitOfUse.created_at.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
