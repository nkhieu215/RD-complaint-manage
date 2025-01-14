import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReasonService } from '../service/reason.service';
import { IReason } from '../reason.model';
import { ReasonFormService } from './reason-form.service';

import { ReasonUpdateComponent } from './reason-update.component';

describe('Reason Management Update Component', () => {
  let comp: ReasonUpdateComponent;
  let fixture: ComponentFixture<ReasonUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let reasonFormService: ReasonFormService;
  let reasonService: ReasonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule.withRoutes([]), ReasonUpdateComponent],
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
      .overrideTemplate(ReasonUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReasonUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reasonFormService = TestBed.inject(ReasonFormService);
    reasonService = TestBed.inject(ReasonService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const reason: IReason = { id: 456 };

      activatedRoute.data = of({ reason });
      comp.ngOnInit();

      expect(comp.reason).toEqual(reason);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReason>>();
      const reason = { id: 123 };
      jest.spyOn(reasonFormService, 'getReason').mockReturnValue(reason);
      jest.spyOn(reasonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reason });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reason }));
      saveSubject.complete();

      // THEN
      expect(reasonFormService.getReason).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(reasonService.update).toHaveBeenCalledWith(expect.objectContaining(reason));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReason>>();
      const reason = { id: 123 };
      jest.spyOn(reasonFormService, 'getReason').mockReturnValue({ id: null });
      jest.spyOn(reasonService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reason: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reason }));
      saveSubject.complete();

      // THEN
      expect(reasonFormService.getReason).toHaveBeenCalled();
      expect(reasonService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReason>>();
      const reason = { id: 123 };
      jest.spyOn(reasonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reason });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reasonService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
