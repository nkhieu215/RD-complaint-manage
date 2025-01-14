import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IListOfError, NewListOfError } from '../list-of-error.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IListOfError for edit and NewListOfErrorFormGroupInput for create.
 */
type ListOfErrorFormGroupInput = IListOfError | PartialWithRequiredKeyOf<NewListOfError>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IListOfError | NewListOfError> = Omit<T, 'created_at' | 'updated_at' | 'check_time'> & {
  created_at?: string | null;
  updated_at?: string | null;
  check_time?: string | null;
};

type ListOfErrorFormRawValue = FormValueOf<IListOfError>;

type NewListOfErrorFormRawValue = FormValueOf<NewListOfError>;

type ListOfErrorFormDefaults = Pick<NewListOfError, 'id' | 'created_at' | 'updated_at' | 'check_time'>;

type ListOfErrorFormGroupContent = {
  id: FormControl<ListOfErrorFormRawValue['id'] | NewListOfError['id']>;
  error_code: FormControl<ListOfErrorFormRawValue['error_code']>;
  error_name: FormControl<ListOfErrorFormRawValue['error_name']>;
  quantity: FormControl<ListOfErrorFormRawValue['quantity']>;
  error_source: FormControl<ListOfErrorFormRawValue['error_source']>;
  reason_id: FormControl<ListOfErrorFormRawValue['reason_id']>;
  method: FormControl<ListOfErrorFormRawValue['method']>;
  check_by_id: FormControl<ListOfErrorFormRawValue['check_by_id']>;
  create_by: FormControl<ListOfErrorFormRawValue['create_by']>;
  image: FormControl<ListOfErrorFormRawValue['image']>;
  created_at: FormControl<ListOfErrorFormRawValue['created_at']>;
  updated_at: FormControl<ListOfErrorFormRawValue['updated_at']>;
  check_time: FormControl<ListOfErrorFormRawValue['check_time']>;
  complaint_id: FormControl<ListOfErrorFormRawValue['complaint_id']>;
};

export type ListOfErrorFormGroup = FormGroup<ListOfErrorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ListOfErrorFormService {
  createListOfErrorFormGroup(listOfError: ListOfErrorFormGroupInput = { id: null }): ListOfErrorFormGroup {
    const listOfErrorRawValue = this.convertListOfErrorToListOfErrorRawValue({
      ...this.getFormDefaults(),
      ...listOfError,
    });
    return new FormGroup<ListOfErrorFormGroupContent>({
      id: new FormControl(
        { value: listOfErrorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      error_code: new FormControl(listOfErrorRawValue.error_code),
      error_name: new FormControl(listOfErrorRawValue.error_name),
      quantity: new FormControl(listOfErrorRawValue.quantity),
      error_source: new FormControl(listOfErrorRawValue.error_source),
      reason_id: new FormControl(listOfErrorRawValue.reason_id),
      method: new FormControl(listOfErrorRawValue.method),
      check_by_id: new FormControl(listOfErrorRawValue.check_by_id),
      create_by: new FormControl(listOfErrorRawValue.create_by),
      image: new FormControl(listOfErrorRawValue.image),
      created_at: new FormControl(listOfErrorRawValue.created_at),
      updated_at: new FormControl(listOfErrorRawValue.updated_at),
      check_time: new FormControl(listOfErrorRawValue.check_time),
      complaint_id: new FormControl(listOfErrorRawValue.complaint_id),
    });
  }

  getListOfError(form: ListOfErrorFormGroup): IListOfError | NewListOfError {
    return this.convertListOfErrorRawValueToListOfError(form.getRawValue() as ListOfErrorFormRawValue | NewListOfErrorFormRawValue);
  }

  resetForm(form: ListOfErrorFormGroup, listOfError: ListOfErrorFormGroupInput): void {
    const listOfErrorRawValue = this.convertListOfErrorToListOfErrorRawValue({ ...this.getFormDefaults(), ...listOfError });
    form.reset(
      {
        ...listOfErrorRawValue,
        id: { value: listOfErrorRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ListOfErrorFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      created_at: currentTime,
      updated_at: currentTime,
      check_time: currentTime,
    };
  }

  private convertListOfErrorRawValueToListOfError(
    rawListOfError: ListOfErrorFormRawValue | NewListOfErrorFormRawValue,
  ): IListOfError | NewListOfError {
    return {
      ...rawListOfError,
      created_at: dayjs(rawListOfError.created_at, DATE_TIME_FORMAT),
      updated_at: dayjs(rawListOfError.updated_at, DATE_TIME_FORMAT),
      check_time: dayjs(rawListOfError.check_time, DATE_TIME_FORMAT),
    };
  }

  private convertListOfErrorToListOfErrorRawValue(
    listOfError: IListOfError | (Partial<NewListOfError> & ListOfErrorFormDefaults),
  ): ListOfErrorFormRawValue | PartialWithRequiredKeyOf<NewListOfErrorFormRawValue> {
    return {
      ...listOfError,
      created_at: listOfError.created_at ? listOfError.created_at.format(DATE_TIME_FORMAT) : undefined,
      updated_at: listOfError.updated_at ? listOfError.updated_at.format(DATE_TIME_FORMAT) : undefined,
      check_time: listOfError.check_time ? listOfError.check_time.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
