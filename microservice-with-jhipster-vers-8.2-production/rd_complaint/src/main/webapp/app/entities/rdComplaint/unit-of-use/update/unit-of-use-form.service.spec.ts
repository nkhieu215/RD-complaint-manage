import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../unit-of-use.test-samples';

import { UnitOfUseFormService } from './unit-of-use-form.service';

describe('UnitOfUse Form Service', () => {
  let service: UnitOfUseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitOfUseFormService);
  });

  describe('Service methods', () => {
    describe('createUnitOfUseFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUnitOfUseFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            create_by: expect.any(Object),
            created_at: expect.any(Object),
          }),
        );
      });

      it('passing IUnitOfUse should create a new form with FormGroup', () => {
        const formGroup = service.createUnitOfUseFormGroup(sampleWithRequiredData);

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

    describe('getUnitOfUse', () => {
      it('should return NewUnitOfUse for default UnitOfUse initial value', () => {
        const formGroup = service.createUnitOfUseFormGroup(sampleWithNewData);

        const unitOfUse = service.getUnitOfUse(formGroup) as any;

        expect(unitOfUse).toMatchObject(sampleWithNewData);
      });

      it('should return NewUnitOfUse for empty UnitOfUse initial value', () => {
        const formGroup = service.createUnitOfUseFormGroup();

        const unitOfUse = service.getUnitOfUse(formGroup) as any;

        expect(unitOfUse).toMatchObject({});
      });

      it('should return IUnitOfUse', () => {
        const formGroup = service.createUnitOfUseFormGroup(sampleWithRequiredData);

        const unitOfUse = service.getUnitOfUse(formGroup) as any;

        expect(unitOfUse).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUnitOfUse should not enable id FormControl', () => {
        const formGroup = service.createUnitOfUseFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUnitOfUse should disable id FormControl', () => {
        const formGroup = service.createUnitOfUseFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
