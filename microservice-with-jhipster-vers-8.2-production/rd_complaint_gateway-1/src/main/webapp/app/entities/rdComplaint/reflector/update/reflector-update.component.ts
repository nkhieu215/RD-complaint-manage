import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IReflector } from '../reflector.model';
import { ReflectorService } from '../service/reflector.service';
import { ReflectorFormService, ReflectorFormGroup } from './reflector-form.service';

@Component({
  standalone: true,
  selector: 'jhi-reflector-update',
  templateUrl: './reflector-update.component.html',
  styleUrls: ['../../shared.component.css'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ReflectorUpdateComponent implements OnInit {
  isSaving = false;
  reflector: IReflector | null = null;

  protected reflectorService = inject(ReflectorService);
  protected reflectorFormService = inject(ReflectorFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ReflectorFormGroup = this.reflectorFormService.createReflectorFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reflector }) => {
      this.reflector = reflector;
      if (reflector) {
        this.updateForm(reflector);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reflector = this.reflectorFormService.getReflector(this.editForm);
    if (reflector.id !== null) {
      this.subscribeToSaveResponse(this.reflectorService.update(reflector));
    } else {
      this.subscribeToSaveResponse(this.reflectorService.create(reflector));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReflector>>): void {
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

  protected updateForm(reflector: IReflector): void {
    this.reflector = reflector;
    this.reflectorFormService.resetForm(this.editForm, reflector);
  }
}
