import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ImplementationResultService } from '../service/implementation-result.service';
import { IImplementationResult } from '../implementation-result.model';
import { ImplementationResultFormService } from './implementation-result-form.service';

import { ImplementationResultUpdateComponent } from './implementation-result-update.component';

describe('ImplementationResult Management Update Component', () => {
  let comp: ImplementationResultUpdateComponent;
  let fixture: ComponentFixture<ImplementationResultUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let implementationResultFormService: ImplementationResultFormService;
  let implementationResultService: ImplementationResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ImplementationResultUpdateComponent],
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
      .overrideTemplate(ImplementationResultUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ImplementationResultUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    implementationResultFormService = TestBed.inject(ImplementationResultFormService);
    implementationResultService = TestBed.inject(ImplementationResultService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const implementationResult: IImplementationResult = { id: 456 };

      activatedRoute.data = of({ implementationResult });
      comp.ngOnInit();

      expect(comp.implementationResult).toEqual(implementationResult);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IImplementationResult>>();
      const implementationResult = { id: 123 };
      jest.spyOn(implementationResultFormService, 'getImplementationResult').mockReturnValue(implementationResult);
      jest.spyOn(implementationResultService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ implementationResult });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: implementationResult }));
      saveSubject.complete();

      // THEN
      expect(implementationResultFormService.getImplementationResult).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(implementationResultService.update).toHaveBeenCalledWith(expect.objectContaining(implementationResult));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IImplementationResult>>();
      const implementationResult = { id: 123 };
      jest.spyOn(implementationResultFormService, 'getImplementationResult').mockReturnValue({ id: null });
      jest.spyOn(implementationResultService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ implementationResult: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: implementationResult }));
      saveSubject.complete();

      // THEN
      expect(implementationResultFormService.getImplementationResult).toHaveBeenCalled();
      expect(implementationResultService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IImplementationResult>>();
      const implementationResult = { id: 123 };
      jest.spyOn(implementationResultService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ implementationResult });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(implementationResultService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
