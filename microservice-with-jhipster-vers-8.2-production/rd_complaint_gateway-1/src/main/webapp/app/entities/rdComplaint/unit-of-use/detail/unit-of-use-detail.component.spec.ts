import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UnitOfUseDetailComponent } from './unit-of-use-detail.component';

describe('UnitOfUse Management Detail Component', () => {
  let comp: UnitOfUseDetailComponent;
  let fixture: ComponentFixture<UnitOfUseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitOfUseDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: UnitOfUseDetailComponent,
              resolve: { unitOfUse: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(UnitOfUseDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitOfUseDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load unitOfUse on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', UnitOfUseDetailComponent);

      // THEN
      expect(instance.unitOfUse).toEqual(expect.objectContaining({ id: 123 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
