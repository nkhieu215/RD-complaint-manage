import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ComplaintStatusService } from '../service/complaint-status.service';
import { IComplaintStatus } from '../complaint-status.model';
import { ComplaintStatusFormService } from './complaint-status-form.service';

import { ComplaintStatusUpdateComponent } from './complaint-status-update.component';

describe('ComplaintStatus Management Update Component', () => {
  let comp: ComplaintStatusUpdateComponent;
  let fixture: ComponentFixture<ComplaintStatusUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let complaintStatusFormService: ComplaintStatusFormService;
  let complaintStatusService: ComplaintStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule.withRoutes([]), ComplaintStatusUpdateComponent],
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
      .overrideTemplate(ComplaintStatusUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ComplaintStatusUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    complaintStatusFormService = TestBed.inject(ComplaintStatusFormService);
    complaintStatusService = TestBed.inject(ComplaintStatusService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const complaintStatus: IComplaintStatus = { id: 456 };

      activatedRoute.data = of({ complaintStatus });
      comp.ngOnInit();

      expect(comp.complaintStatus).toEqual(complaintStatus);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComplaintStatus>>();
      const complaintStatus = { id: 123 };
      jest.spyOn(complaintStatusFormService, 'getComplaintStatus').mockReturnValue(complaintStatus);
      jest.spyOn(complaintStatusService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ complaintStatus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: complaintStatus }));
      saveSubject.complete();

      // THEN
      expect(complaintStatusFormService.getComplaintStatus).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(complaintStatusService.update).toHaveBeenCalledWith(expect.objectContaining(complaintStatus));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComplaintStatus>>();
      const complaintStatus = { id: 123 };
      jest.spyOn(complaintStatusFormService, 'getComplaintStatus').mockReturnValue({ id: null });
      jest.spyOn(complaintStatusService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ complaintStatus: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: complaintStatus }));
      saveSubject.complete();

      // THEN
      expect(complaintStatusFormService.getComplaintStatus).toHaveBeenCalled();
      expect(complaintStatusService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComplaintStatus>>();
      const complaintStatus = { id: 123 };
      jest.spyOn(complaintStatusService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ complaintStatus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(complaintStatusService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
