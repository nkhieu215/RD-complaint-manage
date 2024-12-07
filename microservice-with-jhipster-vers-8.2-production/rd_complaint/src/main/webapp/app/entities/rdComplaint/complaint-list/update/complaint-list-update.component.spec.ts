import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ComplaintListService } from '../service/complaint-list.service';
import { IComplaintList } from '../complaint-list.model';
import { ComplaintListFormService } from './complaint-list-form.service';

import { ComplaintListUpdateComponent } from './complaint-list-update.component';

describe('ComplaintList Management Update Component', () => {
  let comp: ComplaintListUpdateComponent;
  let fixture: ComponentFixture<ComplaintListUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let complaintListFormService: ComplaintListFormService;
  let complaintListService: ComplaintListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ComplaintListUpdateComponent],
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
      .overrideTemplate(ComplaintListUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ComplaintListUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    complaintListFormService = TestBed.inject(ComplaintListFormService);
    complaintListService = TestBed.inject(ComplaintListService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const complaintList: IComplaintList = { id: 456 };

      activatedRoute.data = of({ complaintList });
      comp.ngOnInit();

      expect(comp.complaintList).toEqual(complaintList);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComplaintList>>();
      const complaintList = { id: 123 };
      jest.spyOn(complaintListFormService, 'getComplaintList').mockReturnValue(complaintList);
      jest.spyOn(complaintListService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ complaintList });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: complaintList }));
      saveSubject.complete();

      // THEN
      expect(complaintListFormService.getComplaintList).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(complaintListService.update).toHaveBeenCalledWith(expect.objectContaining(complaintList));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComplaintList>>();
      const complaintList = { id: 123 };
      jest.spyOn(complaintListFormService, 'getComplaintList').mockReturnValue({ id: null });
      jest.spyOn(complaintListService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ complaintList: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: complaintList }));
      saveSubject.complete();

      // THEN
      expect(complaintListFormService.getComplaintList).toHaveBeenCalled();
      expect(complaintListService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComplaintList>>();
      const complaintList = { id: 123 };
      jest.spyOn(complaintListService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ complaintList });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(complaintListService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
