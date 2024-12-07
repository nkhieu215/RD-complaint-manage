import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CheckerListService } from '../service/checker-list.service';
import { ICheckerList } from '../checker-list.model';
import { CheckerListFormService } from './checker-list-form.service';

import { CheckerListUpdateComponent } from './checker-list-update.component';

describe('CheckerList Management Update Component', () => {
  let comp: CheckerListUpdateComponent;
  let fixture: ComponentFixture<CheckerListUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let checkerListFormService: CheckerListFormService;
  let checkerListService: CheckerListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CheckerListUpdateComponent],
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
      .overrideTemplate(CheckerListUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CheckerListUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    checkerListFormService = TestBed.inject(CheckerListFormService);
    checkerListService = TestBed.inject(CheckerListService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const checkerList: ICheckerList = { id: 456 };

      activatedRoute.data = of({ checkerList });
      comp.ngOnInit();

      expect(comp.checkerList).toEqual(checkerList);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICheckerList>>();
      const checkerList = { id: 123 };
      jest.spyOn(checkerListFormService, 'getCheckerList').mockReturnValue(checkerList);
      jest.spyOn(checkerListService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ checkerList });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: checkerList }));
      saveSubject.complete();

      // THEN
      expect(checkerListFormService.getCheckerList).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(checkerListService.update).toHaveBeenCalledWith(expect.objectContaining(checkerList));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICheckerList>>();
      const checkerList = { id: 123 };
      jest.spyOn(checkerListFormService, 'getCheckerList').mockReturnValue({ id: null });
      jest.spyOn(checkerListService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ checkerList: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: checkerList }));
      saveSubject.complete();

      // THEN
      expect(checkerListFormService.getCheckerList).toHaveBeenCalled();
      expect(checkerListService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICheckerList>>();
      const checkerList = { id: 123 };
      jest.spyOn(checkerListService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ checkerList });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(checkerListService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
