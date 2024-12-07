import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IReason } from '../reason.model';
import { ReasonService } from '../service/reason.service';
import { ReasonFormService, ReasonFormGroup } from './reason-form.service';

@Component({
  standalone: true,
  selector: 'jhi-reason-update',
  templateUrl: './reason-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ReasonUpdateComponent implements OnInit {
  isSaving = false;
  reason: IReason | null = null;

  protected reasonService = inject(ReasonService);
  protected reasonFormService = inject(ReasonFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ReasonFormGroup = this.reasonFormService.createReasonFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reason }) => {
      this.reason = reason;
      if (reason) {
        this.updateForm(reason);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reason = this.reasonFormService.getReason(this.editForm);
    if (reason.id !== null) {
      this.subscribeToSaveResponse(this.reasonService.update(reason));
    } else {
      this.subscribeToSaveResponse(this.reasonService.create(reason));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReason>>): void {
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

  protected updateForm(reason: IReason): void {
    this.reason = reason;
    this.reasonFormService.resetForm(this.editForm, reason);
  }
}
