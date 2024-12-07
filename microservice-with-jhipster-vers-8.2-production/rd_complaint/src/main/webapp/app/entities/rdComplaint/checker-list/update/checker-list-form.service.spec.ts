import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../checker-list.test-samples';

import { CheckerListFormService } from './checker-list-form.service';

describe('CheckerList Form Service', () => {
  let service: CheckerListFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckerListFormService);
  });

  describe('Service methods', () => {
    describe('createCheckerListFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCheckerListFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            create_by: expect.any(Object),
            created_at: expect.any(Object),
          }),
        );
      });

      it('passing ICheckerList should create a new form with FormGroup', () => {
        const formGroup = service.createCheckerListFormGroup(sampleWithRequiredData);

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

    describe('getCheckerList', () => {
      it('should return NewCheckerList for default CheckerList initial value', () => {
        const formGroup = service.createCheckerListFormGroup(sampleWithNewData);

        const checkerList = service.getCheckerList(formGroup) as any;

        expect(checkerList).toMatchObject(sampleWithNewData);
      });

      it('should return NewCheckerList for empty CheckerList initial value', () => {
        const formGroup = service.createCheckerListFormGroup();

        const checkerList = service.getCheckerList(formGroup) as any;

        expect(checkerList).toMatchObject({});
      });

      it('should return ICheckerList', () => {
        const formGroup = service.createCheckerListFormGroup(sampleWithRequiredData);

        const checkerList = service.getCheckerList(formGroup) as any;

        expect(checkerList).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICheckerList should not enable id FormControl', () => {
        const formGroup = service.createCheckerListFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCheckerList should disable id FormControl', () => {
        const formGroup = service.createCheckerListFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
