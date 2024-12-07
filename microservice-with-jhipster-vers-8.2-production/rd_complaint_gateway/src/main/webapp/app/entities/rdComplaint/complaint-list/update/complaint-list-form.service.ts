import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IComplaintList, NewComplaintList } from '../complaint-list.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IComplaintList for edit and NewComplaintListFormGroupInput for create.
 */
type ComplaintListFormGroupInput = IComplaintList | PartialWithRequiredKeyOf<NewComplaintList>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IComplaintList | NewComplaintList> = Omit<
  T,
  'production_time' | 'rectification_time' | 'created_at' | 'updated_at'
> & {
  production_time?: string | null;
  rectification_time?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ComplaintListFormRawValue = FormValueOf<IComplaintList>;

type NewComplaintListFormRawValue = FormValueOf<NewComplaintList>;

type ComplaintListFormDefaults = Pick<NewComplaintList, 'id' | 'production_time' | 'rectification_time' | 'created_at' | 'updated_at'>;

type ComplaintListFormGroupContent = {
  id: FormControl<ComplaintListFormRawValue['id'] | NewComplaintList['id']>;
  product_code: FormControl<ComplaintListFormRawValue['product_code']>;
  product_name: FormControl<ComplaintListFormRawValue['product_name']>;
  lot_number: FormControl<ComplaintListFormRawValue['lot_number']>;
  branch: FormControl<ComplaintListFormRawValue['branch']>;
  reflector_id: FormControl<ComplaintListFormRawValue['reflector_id']>;
  total_errors: FormControl<ComplaintListFormRawValue['total_errors']>;
  quantity: FormControl<ComplaintListFormRawValue['quantity']>;
  production_time: FormControl<ComplaintListFormRawValue['production_time']>;
  dapartment_id: FormControl<ComplaintListFormRawValue['dapartment_id']>;
  check_by_id: FormControl<ComplaintListFormRawValue['check_by_id']>;
  rectification_time: FormControl<ComplaintListFormRawValue['rectification_time']>;
  create_by: FormControl<ComplaintListFormRawValue['create_by']>;
  status: FormControl<ComplaintListFormRawValue['status']>;
  complaint_detail: FormControl<ComplaintListFormRawValue['complaint_detail']>;
  unit_of_use_id: FormControl<ComplaintListFormRawValue['unit_of_use_id']>;
  implementation_result_id: FormControl<ComplaintListFormRawValue['implementation_result_id']>;
  comment: FormControl<ComplaintListFormRawValue['comment']>;
  follow_up_comment: FormControl<ComplaintListFormRawValue['follow_up_comment']>;
  complaint_id: FormControl<ComplaintListFormRawValue['complaint_id']>;
  created_at: FormControl<ComplaintListFormRawValue['created_at']>;
  updated_at: FormControl<ComplaintListFormRawValue['updated_at']>;
  serial: FormControl<ComplaintListFormRawValue['serial']>;
  mac_address: FormControl<ComplaintListFormRawValue['mac_address']>;
};

export type ComplaintListFormGroup = FormGroup<ComplaintListFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ComplaintListFormService {
  createComplaintListFormGroup(complaintList: ComplaintListFormGroupInput = { id: null }): ComplaintListFormGroup {
    const complaintListRawValue = this.convertComplaintListToComplaintListRawValue({
      ...this.getFormDefaults(),
      ...complaintList,
    });
    return new FormGroup<ComplaintListFormGroupContent>({
      id: new FormControl(
        { value: complaintListRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      product_code: new FormControl(complaintListRawValue.product_code),
      product_name: new FormControl(complaintListRawValue.product_name),
      lot_number: new FormControl(complaintListRawValue.lot_number),
      branch: new FormControl(complaintListRawValue.branch),
      reflector_id: new FormControl(complaintListRawValue.reflector_id),
      total_errors: new FormControl(complaintListRawValue.total_errors),
      quantity: new FormControl(complaintListRawValue.quantity),
      production_time: new FormControl(complaintListRawValue.production_time),
      dapartment_id: new FormControl(complaintListRawValue.dapartment_id),
      check_by_id: new FormControl(complaintListRawValue.check_by_id),
      rectification_time: new FormControl(complaintListRawValue.rectification_time),
      create_by: new FormControl(complaintListRawValue.create_by),
      status: new FormControl(complaintListRawValue.status),
      complaint_detail: new FormControl(complaintListRawValue.complaint_detail),
      unit_of_use_id: new FormControl(complaintListRawValue.unit_of_use_id),
      implementation_result_id: new FormControl(complaintListRawValue.implementation_result_id),
      comment: new FormControl(complaintListRawValue.comment),
      follow_up_comment: new FormControl(complaintListRawValue.follow_up_comment),
      complaint_id: new FormControl(complaintListRawValue.complaint_id),
      created_at: new FormControl(complaintListRawValue.created_at),
      updated_at: new FormControl(complaintListRawValue.updated_at),
      serial: new FormControl(complaintListRawValue.serial),
      mac_address: new FormControl(complaintListRawValue.mac_address),
    });
  }

  getComplaintList(form: ComplaintListFormGroup): IComplaintList | NewComplaintList {
    return this.convertComplaintListRawValueToComplaintList(form.getRawValue() as ComplaintListFormRawValue | NewComplaintListFormRawValue);
  }

  resetForm(form: ComplaintListFormGroup, complaintList: ComplaintListFormGroupInput): void {
    const complaintListRawValue = this.convertComplaintListToComplaintListRawValue({ ...this.getFormDefaults(), ...complaintList });
    form.reset(
      {
        ...complaintListRawValue,
        id: { value: complaintListRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ComplaintListFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      production_time: currentTime,
      rectification_time: currentTime,
      created_at: currentTime,
      updated_at: currentTime,
    };
  }

  private convertComplaintListRawValueToComplaintList(
    rawComplaintList: ComplaintListFormRawValue | NewComplaintListFormRawValue,
  ): IComplaintList | NewComplaintList {
    return {
      ...rawComplaintList,
      production_time: dayjs(rawComplaintList.production_time, DATE_TIME_FORMAT),
      rectification_time: dayjs(rawComplaintList.rectification_time, DATE_TIME_FORMAT),
      created_at: dayjs(rawComplaintList.created_at, DATE_TIME_FORMAT),
      updated_at: dayjs(rawComplaintList.updated_at, DATE_TIME_FORMAT),
    };
  }

  private convertComplaintListToComplaintListRawValue(
    complaintList: IComplaintList | (Partial<NewComplaintList> & ComplaintListFormDefaults),
  ): ComplaintListFormRawValue | PartialWithRequiredKeyOf<NewComplaintListFormRawValue> {
    return {
      ...complaintList,
      production_time: complaintList.production_time ? complaintList.production_time.format(DATE_TIME_FORMAT) : undefined,
      rectification_time: complaintList.rectification_time ? complaintList.rectification_time.format(DATE_TIME_FORMAT) : undefined,
      created_at: complaintList.created_at ? complaintList.created_at.format(DATE_TIME_FORMAT) : undefined,
      updated_at: complaintList.updated_at ? complaintList.updated_at.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
