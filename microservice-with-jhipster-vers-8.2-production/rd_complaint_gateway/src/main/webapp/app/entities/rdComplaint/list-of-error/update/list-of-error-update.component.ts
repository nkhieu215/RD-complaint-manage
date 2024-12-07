import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IListOfError } from '../list-of-error.model';
import { ListOfErrorService } from '../service/list-of-error.service';
import { ListOfErrorFormService, ListOfErrorFormGroup } from './list-of-error-form.service';

@Component({
  standalone: true,
  selector: 'jhi-list-of-error-update',
  templateUrl: './list-of-error-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ListOfErrorUpdateComponent implements OnInit {
  isSaving = false;
  listOfError: IListOfError | null = null;

  protected listOfErrorService = inject(ListOfErrorService);
  protected listOfErrorFormService = inject(ListOfErrorFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ListOfErrorFormGroup = this.listOfErrorFormService.createListOfErrorFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ listOfError }) => {
      this.listOfError = listOfError;
      if (listOfError) {
        this.updateForm(listOfError);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const listOfError = this.listOfErrorFormService.getListOfError(this.editForm);
    if (listOfError.id !== null) {
      this.subscribeToSaveResponse(this.listOfErrorService.update(listOfError));
    } else {
      this.subscribeToSaveResponse(this.listOfErrorService.create(listOfError));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IListOfError>>): void {
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

  protected updateForm(listOfError: IListOfError): void {
    this.listOfError = listOfError;
    this.listOfErrorFormService.resetForm(this.editForm, listOfError);
  }
}
