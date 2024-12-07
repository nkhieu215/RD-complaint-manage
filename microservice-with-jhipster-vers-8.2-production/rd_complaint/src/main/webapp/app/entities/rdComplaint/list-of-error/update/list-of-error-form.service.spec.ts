import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../list-of-error.test-samples';

import { ListOfErrorFormService } from './list-of-error-form.service';

describe('ListOfError Form Service', () => {
  let service: ListOfErrorFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListOfErrorFormService);
  });

  describe('Service methods', () => {
    describe('createListOfErrorFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createListOfErrorFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            error_code: expect.any(Object),
            error_name: expect.any(Object),
            quantity: expect.any(Object),
            error_source: expect.any(Object),
            reason_id: expect.any(Object),
            method: expect.any(Object),
            check_by_id: expect.any(Object),
            create_by: expect.any(Object),
            image: expect.any(Object),
            created_at: expect.any(Object),
            updated_at: expect.any(Object),
            check_time: expect.any(Object),
            complaint_id: expect.any(Object),
          }),
        );
      });

      it('passing IListOfError should create a new form with FormGroup', () => {
        const formGroup = service.createListOfErrorFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            error_code: expect.any(Object),
            error_name: expect.any(Object),
            quantity: expect.any(Object),
            error_source: expect.any(Object),
            reason_id: expect.any(Object),
            method: expect.any(Object),
            check_by_id: expect.any(Object),
            create_by: expect.any(Object),
            image: expect.any(Object),
            created_at: expect.any(Object),
            updated_at: expect.any(Object),
            check_time: expect.any(Object),
            complaint_id: expect.any(Object),
          }),
        );
      });
    });

    describe('getListOfError', () => {
      it('should return NewListOfError for default ListOfError initial value', () => {
        const formGroup = service.createListOfErrorFormGroup(sampleWithNewData);

        const listOfError = service.getListOfError(formGroup) as any;

        expect(listOfError).toMatchObject(sampleWithNewData);
      });

      it('should return NewListOfError for empty ListOfError initial value', () => {
        const formGroup = service.createListOfErrorFormGroup();

        const listOfError = service.getListOfError(formGroup) as any;

        expect(listOfError).toMatchObject({});
      });

      it('should return IListOfError', () => {
        const formGroup = service.createListOfErrorFormGroup(sampleWithRequiredData);

        const listOfError = service.getListOfError(formGroup) as any;

        expect(listOfError).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IListOfError should not enable id FormControl', () => {
        const formGroup = service.createListOfErrorFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewListOfError should disable id FormControl', () => {
        const formGroup = service.createListOfErrorFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
