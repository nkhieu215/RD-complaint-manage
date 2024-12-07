import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ComplaintService } from '../service/complaint.service';
import { IComplaint } from '../complaint.model';
import { ComplaintFormService } from './complaint-form.service';

import { ComplaintUpdateComponent } from './complaint-update.component';

describe('Complaint Management Update Component', () => {
  let comp: ComplaintUpdateComponent;
  let fixture: ComponentFixture<ComplaintUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let complaintFormService: ComplaintFormService;
  let complaintService: ComplaintService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule.withRoutes([]), ComplaintUpdateComponent],
    providers: [
        FormBuilder,
        {
            provide: ActivatedRoute,
            useValue: {
                params: from([{}]),
            },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
})
      .overrideTemplate(ComplaintUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ComplaintUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    complaintFormService = TestBed.inject(ComplaintFormService);
    complaintService = TestBed.inject(ComplaintService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const complaint: IComplaint = { id: 456 };

      activatedRoute.data = of({ complaint });
      comp.ngOnInit();

      expect(comp.complaint).toEqual(complaint);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComplaint>>();
      const complaint = { id: 123 };
      jest.spyOn(complaintFormService, 'getComplaint').mockReturnValue(complaint);
      jest.spyOn(complaintService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ complaint });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: complaint }));
      saveSubject.complete();

      // THEN
      expect(complaintFormService.getComplaint).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(complaintService.update).toHaveBeenCalledWith(expect.objectContaining(complaint));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComplaint>>();
      const complaint = { id: 123 };
      jest.spyOn(complaintFormService, 'getComplaint').mockReturnValue({ id: null });
      jest.spyOn(complaintService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ complaint: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: complaint }));
      saveSubject.complete();

      // THEN
      expect(complaintFormService.getComplaint).toHaveBeenCalled();
      expect(complaintService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComplaint>>();
      const complaint = { id: 123 };
      jest.spyOn(complaintService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ complaint });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(complaintService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
