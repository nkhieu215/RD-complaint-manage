import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../complaint-status.test-samples';

import { ComplaintStatusFormService } from './complaint-status-form.service';

describe('ComplaintStatus Form Service', () => {
  let service: ComplaintStatusFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplaintStatusFormService);
  });

  describe('Service methods', () => {
    describe('createComplaintStatusFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createComplaintStatusFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            create_by: expect.any(Object),
            created_at: expect.any(Object),
          }),
        );
      });

      it('passing IComplaintStatus should create a new form with FormGroup', () => {
        const formGroup = service.createComplaintStatusFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            create_by: expect.any(Object),
            created_at: expect.any(Object),
          }),
        );
      });
    });

    describe('getComplaintStatus', () => {
      it('should return NewComplaintStatus for default ComplaintStatus initial value', () => {
        const formGroup = service.createComplaintStatusFormGroup(sampleWithNewData);

        const complaintStatus = service.getComplaintStatus(formGroup) as any;

        expect(complaintStatus).toMatchObject(sampleWithNewData);
      });

      it('should return NewComplaintStatus for empty ComplaintStatus initial value', () => {
        const formGroup = service.createComplaintStatusFormGroup();

        const complaintStatus = service.getComplaintStatus(formGroup) as any;

        expect(complaintStatus).toMatchObject({});
      });

      it('should return IComplaintStatus', () => {
        const formGroup = service.createComplaintStatusFormGroup(sampleWithRequiredData);

        const complaintStatus = service.getComplaintStatus(formGroup) as any;

        expect(complaintStatus).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IComplaintStatus should not enable id FormControl', () => {
        const formGroup = service.createComplaintStatusFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewComplaintStatus should disable id FormControl', () => {
        const formGroup = service.createComplaintStatusFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
