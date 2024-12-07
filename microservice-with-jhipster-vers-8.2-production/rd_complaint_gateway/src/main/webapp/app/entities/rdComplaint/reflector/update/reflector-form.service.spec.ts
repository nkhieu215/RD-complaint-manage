import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../reflector.test-samples';

import { ReflectorFormService } from './reflector-form.service';

describe('Reflector Form Service', () => {
  let service: ReflectorFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReflectorFormService);
  });

  describe('Service methods', () => {
    describe('createReflectorFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createReflectorFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            create_by: expect.any(Object),
            created_at: expect.any(Object),
          }),
        );
      });

      it('passing IReflector should create a new form with FormGroup', () => {
        const formGroup = service.createReflectorFormGroup(sampleWithRequiredData);

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

    describe('getReflector', () => {
      it('should return NewReflector for default Reflector initial value', () => {
        const formGroup = service.createReflectorFormGroup(sampleWithNewData);

        const reflector = service.getReflector(formGroup) as any;

        expect(reflector).toMatchObject(sampleWithNewData);
      });

      it('should return NewReflector for empty Reflector initial value', () => {
        const formGroup = service.createReflectorFormGroup();

        const reflector = service.getReflector(formGroup) as any;

        expect(reflector).toMatchObject({});
      });

      it('should return IReflector', () => {
        const formGroup = service.createReflectorFormGroup(sampleWithRequiredData);

        const reflector = service.getReflector(formGroup) as any;

        expect(reflector).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IReflector should not enable id FormControl', () => {
        const formGroup = service.createReflectorFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewReflector should disable id FormControl', () => {
        const formGroup = service.createReflectorFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
