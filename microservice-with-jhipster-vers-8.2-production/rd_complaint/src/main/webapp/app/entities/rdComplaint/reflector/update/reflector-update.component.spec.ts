import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReflectorService } from '../service/reflector.service';
import { IReflector } from '../reflector.model';
import { ReflectorFormService } from './reflector-form.service';

import { ReflectorUpdateComponent } from './reflector-update.component';

describe('Reflector Management Update Component', () => {
  let comp: ReflectorUpdateComponent;
  let fixture: ComponentFixture<ReflectorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let reflectorFormService: ReflectorFormService;
  let reflectorService: ReflectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ReflectorUpdateComponent],
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
      .overrideTemplate(ReflectorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReflectorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reflectorFormService = TestBed.inject(ReflectorFormService);
    reflectorService = TestBed.inject(ReflectorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const reflector: IReflector = { id: 456 };

      activatedRoute.data = of({ reflector });
      comp.ngOnInit();

      expect(comp.reflector).toEqual(reflector);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReflector>>();
      const reflector = { id: 123 };
      jest.spyOn(reflectorFormService, 'getReflector').mockReturnValue(reflector);
      jest.spyOn(reflectorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reflector });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reflector }));
      saveSubject.complete();

      // THEN
      expect(reflectorFormService.getReflector).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(reflectorService.update).toHaveBeenCalledWith(expect.objectContaining(reflector));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReflector>>();
      const reflector = { id: 123 };
      jest.spyOn(reflectorFormService, 'getReflector').mockReturnValue({ id: null });
      jest.spyOn(reflectorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reflector: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reflector }));
      saveSubject.complete();

      // THEN
      expect(reflectorFormService.getReflector).toHaveBeenCalled();
      expect(reflectorService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReflector>>();
      const reflector = { id: 123 };
      jest.spyOn(reflectorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reflector });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reflectorService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
