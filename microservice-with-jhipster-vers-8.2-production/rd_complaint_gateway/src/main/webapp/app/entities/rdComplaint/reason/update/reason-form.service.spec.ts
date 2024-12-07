import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../reason.test-samples';

import { ReasonFormService } from './reason-form.service';

describe('Reason Form Service', () => {
  let service: ReasonFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReasonFormService);
  });

  describe('Service methods', () => {
    describe('createReasonFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createReasonFormGroup();

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

      it('passing IReason should create a new form with FormGroup', () => {
        const formGroup = service.createReasonFormGroup(sampleWithRequiredData);

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

    describe('getReason', () => {
      it('should return NewReason for default Reason initial value', () => {
        const formGroup = service.createReasonFormGroup(sampleWithNewData);

        const reason = service.getReason(formGroup) as any;

        expect(reason).toMatchObject(sampleWithNewData);
      });

      it('should return NewReason for empty Reason initial value', () => {
        const formGroup = service.createReasonFormGroup();

        const reason = service.getReason(formGroup) as any;

        expect(reason).toMatchObject({});
      });

      it('should return IReason', () => {
        const formGroup = service.createReasonFormGroup(sampleWithRequiredData);

        const reason = service.getReason(formGroup) as any;

        expect(reason).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IReason should not enable id FormControl', () => {
        const formGroup = service.createReasonFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewReason should disable id FormControl', () => {
        const formGroup = service.createReasonFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
