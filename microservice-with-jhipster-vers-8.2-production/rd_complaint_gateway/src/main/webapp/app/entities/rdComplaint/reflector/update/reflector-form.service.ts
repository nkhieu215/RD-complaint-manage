import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IReflector, NewReflector } from '../reflector.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReflector for edit and NewReflectorFormGroupInput for create.
 */
type ReflectorFormGroupInput = IReflector | PartialWithRequiredKeyOf<NewReflector>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IReflector | NewReflector> = Omit<T, 'created_at'> & {
  created_at?: string | null;
};

type ReflectorFormRawValue = FormValueOf<IReflector>;

type NewReflectorFormRawValue = FormValueOf<NewReflector>;

type ReflectorFormDefaults = Pick<NewReflector, 'id' | 'created_at'>;

type ReflectorFormGroupContent = {
  id: FormControl<ReflectorFormRawValue['id'] | NewReflector['id']>;
  name: FormControl<ReflectorFormRawValue['name']>;
  create_by: FormControl<ReflectorFormRawValue['create_by']>;
  created_at: FormControl<ReflectorFormRawValue['created_at']>;
};

export type ReflectorFormGroup = FormGroup<ReflectorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReflectorFormService {
  createReflectorFormGroup(reflector: ReflectorFormGroupInput = { id: null }): ReflectorFormGroup {
    const reflectorRawValue = this.convertReflectorToReflectorRawValue({
      ...this.getFormDefaults(),
      ...reflector,
    });
    return new FormGroup<ReflectorFormGroupContent>({
      id: new FormControl(
        { value: reflectorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(reflectorRawValue.name),
      create_by: new FormControl(reflectorRawValue.create_by),
      created_at: new FormControl(reflectorRawValue.created_at),
    });
  }

  getReflector(form: ReflectorFormGroup): IReflector | NewReflector {
    return this.convertReflectorRawValueToReflector(form.getRawValue() as ReflectorFormRawValue | NewReflectorFormRawValue);
  }

  resetForm(form: ReflectorFormGroup, reflector: ReflectorFormGroupInput): void {
    const reflectorRawValue = this.convertReflectorToReflectorRawValue({ ...this.getFormDefaults(), ...reflector });
    form.reset(
      {
        ...reflectorRawValue,
        id: { value: reflectorRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ReflectorFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      created_at: currentTime,
    };
  }

  private convertReflectorRawValueToReflector(rawReflector: ReflectorFormRawValue | NewReflectorFormRawValue): IReflector | NewReflector {
    return {
      ...rawReflector,
      created_at: dayjs(rawReflector.created_at, DATE_TIME_FORMAT),
    };
  }

  private convertReflectorToReflectorRawValue(
    reflector: IReflector | (Partial<NewReflector> & ReflectorFormDefaults),
  ): ReflectorFormRawValue | PartialWithRequiredKeyOf<NewReflectorFormRawValue> {
    return {
      ...reflector,
      created_at: reflector.created_at ? reflector.created_at.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
