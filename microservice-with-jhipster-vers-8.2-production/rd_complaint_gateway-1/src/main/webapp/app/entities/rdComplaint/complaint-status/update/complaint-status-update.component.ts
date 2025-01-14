import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IComplaintStatus } from '../complaint-status.model';
import { ComplaintStatusService } from '../service/complaint-status.service';
import { ComplaintStatusFormService, ComplaintStatusFormGroup } from './complaint-status-form.service';

@Component({
  standalone: true,
  selector: 'jhi-complaint-status-update',
  templateUrl: './complaint-status-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ComplaintStatusUpdateComponent implements OnInit {
  isSaving = false;
  complaintStatus: IComplaintStatus | null = null;

  protected complaintStatusService = inject(ComplaintStatusService);
  protected complaintStatusFormService = inject(ComplaintStatusFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ComplaintStatusFormGroup = this.complaintStatusFormService.createComplaintStatusFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ complaintStatus }) => {
      this.complaintStatus = complaintStatus;
      if (complaintStatus) {
        this.updateForm(complaintStatus);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const complaintStatus = this.complaintStatusFormService.getComplaintStatus(this.editForm);
    if (complaintStatus.id !== null) {
      this.subscribeToSaveResponse(this.complaintStatusService.update(complaintStatus));
    } else {
      this.subscribeToSaveResponse(this.complaintStatusService.create(complaintStatus));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComplaintStatus>>): void {
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

  protected updateForm(complaintStatus: IComplaintStatus): void {
    this.complaintStatus = complaintStatus;
    this.complaintStatusFormService.resetForm(this.editForm, complaintStatus);
  }
}
