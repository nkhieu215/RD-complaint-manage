import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../implementation-result.test-samples';

import { ImplementationResultFormService } from './implementation-result-form.service';

describe('ImplementationResult Form Service', () => {
  let service: ImplementationResultFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImplementationResultFormService);
  });

  describe('Service methods', () => {
    describe('createImplementationResultFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createImplementationResultFormGroup();

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

      it('passing IImplementationResult should create a new form with FormGroup', () => {
        const formGroup = service.createImplementationResultFormGroup(sampleWithRequiredData);

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

    describe('getImplementationResult', () => {
      it('should return NewImplementationResult for default ImplementationResult initial value', () => {
        const formGroup = service.createImplementationResultFormGroup(sampleWithNewData);

        const implementationResult = service.getImplementationResult(formGroup) as any;

        expect(implementationResult).toMatchObject(sampleWithNewData);
      });

      it('should return NewImplementationResult for empty ImplementationResult initial value', () => {
        const formGroup = service.createImplementationResultFormGroup();

        const implementationResult = service.getImplementationResult(formGroup) as any;

        expect(implementationResult).toMatchObject({});
      });

      it('should return IImplementationResult', () => {
        const formGroup = service.createImplementationResultFormGroup(sampleWithRequiredData);

        const implementationResult = service.getImplementationResult(formGroup) as any;

        expect(implementationResult).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IImplementationResult should not enable id FormControl', () => {
        const formGroup = service.createImplementationResultFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewImplementationResult should disable id FormControl', () => {
        const formGroup = service.createImplementationResultFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
