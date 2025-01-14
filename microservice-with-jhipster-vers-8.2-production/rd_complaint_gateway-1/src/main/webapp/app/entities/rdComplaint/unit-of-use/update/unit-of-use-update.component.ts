import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUnitOfUse } from '../unit-of-use.model';
import { UnitOfUseService } from '../service/unit-of-use.service';
import { UnitOfUseFormService, UnitOfUseFormGroup } from './unit-of-use-form.service';

@Component({
  standalone: true,
  selector: 'jhi-unit-of-use-update',
  templateUrl: './unit-of-use-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UnitOfUseUpdateComponent implements OnInit {
  isSaving = false;
  unitOfUse: IUnitOfUse | null = null;

  protected unitOfUseService = inject(UnitOfUseService);
  protected unitOfUseFormService = inject(UnitOfUseFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: UnitOfUseFormGroup = this.unitOfUseFormService.createUnitOfUseFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ unitOfUse }) => {
      this.unitOfUse = unitOfUse;
      if (unitOfUse) {
        this.updateForm(unitOfUse);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const unitOfUse = this.unitOfUseFormService.getUnitOfUse(this.editForm);
    if (unitOfUse.id !== null) {
      this.subscribeToSaveResponse(this.unitOfUseService.update(unitOfUse));
    } else {
      this.subscribeToSaveResponse(this.unitOfUseService.create(unitOfUse));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUnitOfUse>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(unitOfUse: IUnitOfUse): void {
    this.unitOfUse = unitOfUse;
    this.unitOfUseFormService.resetForm(this.editForm, unitOfUse);
  }
}
