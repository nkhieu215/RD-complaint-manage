import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IImplementationResult } from '../implementation-result.model';
import { ImplementationResultService } from '../service/implementation-result.service';
import { ImplementationResultFormService, ImplementationResultFormGroup } from './implementation-result-form.service';

@Component({
  standalone: true,
  selector: 'jhi-implementation-result-update',
  templateUrl: './implementation-result-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ImplementationResultUpdateComponent implements OnInit {
  isSaving = false;
  implementationResult: IImplementationResult | null = null;

  protected implementationResultService = inject(ImplementationResultService);
  protected implementationResultFormService = inject(ImplementationResultFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ImplementationResultFormGroup = this.implementationResultFormService.createImplementationResultFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ implementationResult }) => {
      this.implementationResult = implementationResult;
      if (implementationResult) {
        this.updateForm(implementationResult);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const implementationResult = this.implementationResultFormService.getImplementationResult(this.editForm);
    if (implementationResult.id !== null) {
      this.subscribeToSaveResponse(this.implementationResultService.update(implementationResult));
    } else {
      this.subscribeToSaveResponse(this.implementationResultService.create(implementationResult));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IImplementationResult>>): void {
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

  protected updateForm(implementationResult: IImplementationResult): void {
    this.implementationResult = implementationResult;
    this.implementationResultFormService.resetForm(this.editForm, implementationResult);
  }
}
