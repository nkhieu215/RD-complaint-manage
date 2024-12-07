import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ListOfErrorService } from '../service/list-of-error.service';
import { IListOfError } from '../list-of-error.model';
import { ListOfErrorFormService } from './list-of-error-form.service';

import { ListOfErrorUpdateComponent } from './list-of-error-update.component';

describe('ListOfError Management Update Component', () => {
  let comp: ListOfErrorUpdateComponent;
  let fixture: ComponentFixture<ListOfErrorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let listOfErrorFormService: ListOfErrorFormService;
  let listOfErrorService: ListOfErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ListOfErrorUpdateComponent],
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
      .overrideTemplate(ListOfErrorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ListOfErrorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    listOfErrorFormService = TestBed.inject(ListOfErrorFormService);
    listOfErrorService = TestBed.inject(ListOfErrorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const listOfError: IListOfError = { id: 456 };

      activatedRoute.data = of({ listOfError });
      comp.ngOnInit();

      expect(comp.listOfError).toEqual(listOfError);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IListOfError>>();
      const listOfError = { id: 123 };
      jest.spyOn(listOfErrorFormService, 'getListOfError').mockReturnValue(listOfError);
      jest.spyOn(listOfErrorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ listOfError });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: listOfError }));
      saveSubject.complete();

      // THEN
      expect(listOfErrorFormService.getListOfError).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(listOfErrorService.update).toHaveBeenCalledWith(expect.objectContaining(listOfError));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IListOfError>>();
      const listOfError = { id: 123 };
      jest.spyOn(listOfErrorFormService, 'getListOfError').mockReturnValue({ id: null });
      jest.spyOn(listOfErrorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ listOfError: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: listOfError }));
      saveSubject.complete();

      // THEN
      expect(listOfErrorFormService.getListOfError).toHaveBeenCalled();
      expect(listOfErrorService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IListOfError>>();
      const listOfError = { id: 123 };
      jest.spyOn(listOfErrorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ listOfError });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(listOfErrorService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
