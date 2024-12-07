import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IComplaintList } from '../complaint-list.model';
import { ComplaintListService } from '../service/complaint-list.service';
import { ComplaintListFormService, ComplaintListFormGroup } from './complaint-list-form.service';

@Component({
  standalone: true,
  selector: 'jhi-complaint-list-update',
  templateUrl: './complaint-list-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ComplaintListUpdateComponent implements OnInit {
  isSaving = false;
  complaintList: IComplaintList | null = null;

  protected complaintListService = inject(ComplaintListService);
  protected complaintListFormService = inject(ComplaintListFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ComplaintListFormGroup = this.complaintListFormService.createComplaintListFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ complaintList }) => {
      this.complaintList = complaintList;
      if (complaintList) {
        this.updateForm(complaintList);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const complaintList = this.complaintListFormService.getComplaintList(this.editForm);
    if (complaintList.id !== null) {
      this.subscribeToSaveResponse(this.complaintListService.update(complaintList));
    } else {
      this.subscribeToSaveResponse(this.complaintListService.create(complaintList));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComplaintList>>): void {
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

  protected updateForm(complaintList: IComplaintList): void {
    this.complaintList = complaintList;
    this.complaintListFormService.resetForm(this.editForm, complaintList);
  }
}
