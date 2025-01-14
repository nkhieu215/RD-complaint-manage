import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../complaint.test-samples';

import { ComplaintFormService } from './complaint-form.service';

describe('Complaint Form Service', () => {
  let service: ComplaintFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplaintFormService);
  });

  describe('Service methods', () => {
    describe('createComplaintFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createComplaintFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            create_by: expect.any(Object),
            created_at: expect.any(Object),
            status: expect.any(Object),
          }),
        );
      });

      it('passing IComplaint should create a new form with FormGroup', () => {
        const formGroup = service.createComplaintFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            create_by: expect.any(Object),
            created_at: expect.any(Object),
            status: expect.any(Object),
          }),
        );
      });
    });

    describe('getComplaint', () => {
      it('should return NewComplaint for default Complaint initial value', () => {
        const formGroup = service.createComplaintFormGroup(sampleWithNewData);

        const complaint = service.getComplaint(formGroup) as any;

        expect(complaint).toMatchObject(sampleWithNewData);
      });

      it('should return NewComplaint for empty Complaint initial value', () => {
        const formGroup = service.createComplaintFormGroup();

        const complaint = service.getComplaint(formGroup) as any;

        expect(complaint).toMatchObject({});
      });

      it('should return IComplaint', () => {
        const formGroup = service.createComplaintFormGroup(sampleWithRequiredData);

        const complaint = service.getComplaint(formGroup) as any;

        expect(complaint).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IComplaint should not enable id FormControl', () => {
        const formGroup = service.createComplaintFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewComplaint should disable id FormControl', () => {
        const formGroup = service.createComplaintFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
