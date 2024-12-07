import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../complaint-list.test-samples';

import { ComplaintListFormService } from './complaint-list-form.service';

describe('ComplaintList Form Service', () => {
  let service: ComplaintListFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplaintListFormService);
  });

  describe('Service methods', () => {
    describe('createComplaintListFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createComplaintListFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            product_code: expect.any(Object),
            product_name: expect.any(Object),
            lot_number: expect.any(Object),
            branch: expect.any(Object),
            reflector_id: expect.any(Object),
            total_errors: expect.any(Object),
            quantity: expect.any(Object),
            production_time: expect.any(Object),
            dapartment_id: expect.any(Object),
            check_by_id: expect.any(Object),
            rectification_time: expect.any(Object),
            create_by: expect.any(Object),
            status: expect.any(Object),
            complaint_detail: expect.any(Object),
            unit_of_use_id: expect.any(Object),
            implementation_result_id: expect.any(Object),
            comment: expect.any(Object),
            follow_up_comment: expect.any(Object),
            complaint_id: expect.any(Object),
            created_at: expect.any(Object),
            updated_at: expect.any(Object),
            serial: expect.any(Object),
            mac_address: expect.any(Object),
          }),
        );
      });

      it('passing IComplaintList should create a new form with FormGroup', () => {
        const formGroup = service.createComplaintListFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            product_code: expect.any(Object),
            product_name: expect.any(Object),
            lot_number: expect.any(Object),
            branch: expect.any(Object),
            reflector_id: expect.any(Object),
            total_errors: expect.any(Object),
            quantity: expect.any(Object),
            production_time: expect.any(Object),
            dapartment_id: expect.any(Object),
            check_by_id: expect.any(Object),
            rectification_time: expect.any(Object),
            create_by: expect.any(Object),
            status: expect.any(Object),
            complaint_detail: expect.any(Object),
            unit_of_use_id: expect.any(Object),
            implementation_result_id: expect.any(Object),
            comment: expect.any(Object),
            follow_up_comment: expect.any(Object),
            complaint_id: expect.any(Object),
            created_at: expect.any(Object),
            updated_at: expect.any(Object),
            serial: expect.any(Object),
            mac_address: expect.any(Object),
          }),
        );
      });
    });

    describe('getComplaintList', () => {
      it('should return NewComplaintList for default ComplaintList initial value', () => {
        const formGroup = service.createComplaintListFormGroup(sampleWithNewData);

        const complaintList = service.getComplaintList(formGroup) as any;

        expect(complaintList).toMatchObject(sampleWithNewData);
      });

      it('should return NewComplaintList for empty ComplaintList initial value', () => {
        const formGroup = service.createComplaintListFormGroup();

        const complaintList = service.getComplaintList(formGroup) as any;

        expect(complaintList).toMatchObject({});
      });

      it('should return IComplaintList', () => {
        const formGroup = service.createComplaintListFormGroup(sampleWithRequiredData);

        const complaintList = service.getComplaintList(formGroup) as any;

        expect(complaintList).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IComplaintList should not enable id FormControl', () => {
        const formGroup = service.createComplaintListFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewComplaintList should disable id FormControl', () => {
        const formGroup = service.createComplaintListFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
