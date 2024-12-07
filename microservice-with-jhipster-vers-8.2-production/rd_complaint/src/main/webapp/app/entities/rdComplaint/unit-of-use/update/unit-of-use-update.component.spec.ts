import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UnitOfUseService } from '../service/unit-of-use.service';
import { IUnitOfUse } from '../unit-of-use.model';
import { UnitOfUseFormService } from './unit-of-use-form.service';

import { UnitOfUseUpdateComponent } from './unit-of-use-update.component';

describe('UnitOfUse Management Update Component', () => {
  let comp: UnitOfUseUpdateComponent;
  let fixture: ComponentFixture<UnitOfUseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let unitOfUseFormService: UnitOfUseFormService;
  let unitOfUseService: UnitOfUseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), UnitOfUseUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(UnitOfUseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UnitOfUseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    unitOfUseFormService = TestBed.inject(UnitOfUseFormService);
    unitOfUseService = TestBed.inject(UnitOfUseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const unitOfUse: IUnitOfUse = { id: 456 };

      activatedRoute.data = of({ unitOfUse });
      comp.ngOnInit();

      expect(comp.unitOfUse).toEqual(unitOfUse);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUnitOfUse>>();
      const unitOfUse = { id: 123 };
      jest.spyOn(unitOfUseFormService, 'getUnitOfUse').mockReturnValue(unitOfUse);
      jest.spyOn(unitOfUseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ unitOfUse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: unitOfUse }));
      saveSubject.complete();

      // THEN
      expect(unitOfUseFormService.getUnitOfUse).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(unitOfUseService.update).toHaveBeenCalledWith(expect.objectContaining(unitOfUse));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUnitOfUse>>();
      const unitOfUse = { id: 123 };
      jest.spyOn(unitOfUseFormService, 'getUnitOfUse').mockReturnValue({ id: null });
      jest.spyOn(unitOfUseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ unitOfUse: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: unitOfUse }));
      saveSubject.complete();

      // THEN
      expect(unitOfUseFormService.getUnitOfUse).toHaveBeenCalled();
      expect(unitOfUseService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUnitOfUse>>();
      const unitOfUse = { id: 123 };
      jest.spyOn(unitOfUseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ unitOfUse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(unitOfUseService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
