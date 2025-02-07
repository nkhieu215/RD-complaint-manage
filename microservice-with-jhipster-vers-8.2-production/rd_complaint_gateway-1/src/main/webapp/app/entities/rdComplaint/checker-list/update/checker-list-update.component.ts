import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICheckerList } from '../checker-list.model';
import { CheckerListService } from '../service/checker-list.service';
import { CheckerListFormService, CheckerListFormGroup } from './checker-list-form.service';

@Component({
  standalone: true,
  selector: 'jhi-checker-list-update',
  templateUrl: './checker-list-update.component.html',
  styleUrls: ['../../shared.component.css'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CheckerListUpdateComponent implements OnInit {
  isSaving = false;
  checkerList: ICheckerList | null = null;

  protected checkerListService = inject(CheckerListService);
  protected checkerListFormService = inject(CheckerListFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CheckerListFormGroup = this.checkerListFormService.createCheckerListFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ checkerList }) => {
      this.checkerList = checkerList;
      if (checkerList) {
        this.updateForm(checkerList);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const checkerList = this.checkerListFormService.getCheckerList(this.editForm);
    if (checkerList.id !== null) {
      this.subscribeToSaveResponse(this.checkerListService.update(checkerList));
    } else {
      this.subscribeToSaveResponse(this.checkerListService.create(checkerList));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICheckerList>>): void {
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

  protected updateForm(checkerList: ICheckerList): void {
    this.checkerList = checkerList;
    this.checkerListFormService.resetForm(this.editForm, checkerList);
  }
}
