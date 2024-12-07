import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IImplementationResult, NewImplementationResult } from '../implementation-result.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IImplementationResult for edit and NewImplementationResultFormGroupInput for create.
 */
type ImplementationResultFormGroupInput = IImplementationResult | PartialWithRequiredKeyOf<NewImplementationResult>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IImplementationResult | NewImplementationResult> = Omit<T, 'created_at'> & {
  created_at?: string | null;
};

type ImplementationResultFormRawValue = FormValueOf<IImplementationResult>;

type NewImplementationResultFormRawValue = FormValueOf<NewImplementationResult>;

type ImplementationResultFormDefaults = Pick<NewImplementationResult, 'id' | 'created_at'>;

type ImplementationResultFormGroupContent = {
  id: FormControl<ImplementationResultFormRawValue['id'] | NewImplementationResult['id']>;
  name: FormControl<ImplementationResultFormRawValue['name']>;
  create_by: FormControl<ImplementationResultFormRawValue['create_by']>;
  created_at: FormControl<ImplementationResultFormRawValue['created_at']>;
  status: FormControl<ImplementationResultFormRawValue['status']>;
};

export type ImplementationResultFormGroup = FormGroup<ImplementationResultFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ImplementationResultFormService {
  createImplementationResultFormGroup(
    implementationResult: ImplementationResultFormGroupInput = { id: null },
  ): ImplementationResultFormGroup {
    const implementationResultRawValue = this.convertImplementationResultToImplementationResultRawValue({
      ...this.getFormDefaults(),
      ...implementationResult,
    });
    return new FormGroup<ImplementationResultFormGroupContent>({
      id: new FormControl(
        { value: implementationResultRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(implementationResultRawValue.name),
      create_by: new FormControl(implementationResultRawValue.create_by),
      created_at: new FormControl(implementationResultRawValue.created_at),
      status: new FormControl(implementationResultRawValue.status),
    });
  }

  getImplementationResult(form: ImplementationResultFormGroup): IImplementationResult | NewImplementationResult {
    return this.convertImplementationResultRawValueToImplementationResult(
      form.getRawValue() as ImplementationResultFormRawValue | NewImplementationResultFormRawValue,
    );
  }

  resetForm(form: ImplementationResultFormGroup, implementationResult: ImplementationResultFormGroupInput): void {
    const implementationResultRawValue = this.convertImplementationResultToImplementationResultRawValue({
      ...this.getFormDefaults(),
      ...implementationResult,
    });
    form.reset(
      {
        ...implementationResultRawValue,
        id: { value: implementationResultRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ImplementationResultFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      created_at: currentTime,
    };
  }

  private convertImplementationResultRawValueToImplementationResult(
    rawImplementationResult: ImplementationResultFormRawValue | NewImplementationResultFormRawValue,
  ): IImplementationResult | NewImplementationResult {
    return {
      ...rawImplementationResult,
      created_at: dayjs(rawImplementationResult.created_at, DATE_TIME_FORMAT),
    };
  }

  private convertImplementationResultToImplementationResultRawValue(
    implementationResult: IImplementationResult | (Partial<NewImplementationResult> & ImplementationResultFormDefaults),
  ): ImplementationResultFormRawValue | PartialWithRequiredKeyOf<NewImplementationResultFormRawValue> {
    return {
      ...implementationResult,
      created_at: implementationResult.created_at ? implementationResult.created_at.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
