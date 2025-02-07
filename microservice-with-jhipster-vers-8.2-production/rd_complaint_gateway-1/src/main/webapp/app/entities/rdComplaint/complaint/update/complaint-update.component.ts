import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IComplaint } from '../complaint.model';
import { ComplaintService } from '../service/complaint.service';
import { ComplaintFormService, ComplaintFormGroup } from './complaint-form.service';

@Component({
  standalone: true,
  selector: 'jhi-complaint-update',
  templateUrl: './complaint-update.component.html',
  styleUrls: ['../../shared.component.css'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ComplaintUpdateComponent implements OnInit {
  isSaving = false;
  complaint: IComplaint | null = null;

  protected complaintService = inject(ComplaintService);
  protected complaintFormService = inject(ComplaintFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ComplaintFormGroup = this.complaintFormService.createComplaintFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ complaint }) => {
      this.complaint = complaint;
      if (complaint) {
        this.updateForm(complaint);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const complaint = this.complaintFormService.getComplaint(this.editForm);
    if (complaint.id !== null) {
      this.subscribeToSaveResponse(this.complaintService.update(complaint));
    } else {
      this.subscribeToSaveResponse(this.complaintService.create(complaint));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComplaint>>): void {
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

  protected updateForm(complaint: IComplaint): void {
    this.complaint = complaint;
    this.complaintFormService.resetForm(this.editForm, complaint);
  }
}
