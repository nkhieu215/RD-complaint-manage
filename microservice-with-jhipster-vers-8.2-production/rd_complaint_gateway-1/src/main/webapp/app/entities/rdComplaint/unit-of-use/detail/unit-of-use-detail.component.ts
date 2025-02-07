import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IUnitOfUse } from '../unit-of-use.model';

@Component({
  standalone: true,
  selector: 'jhi-unit-of-use-detail',
  templateUrl: './unit-of-use-detail.component.html',
  styleUrls: ['../../shared.component.css'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class UnitOfUseDetailComponent {
  @Input() unitOfUse: IUnitOfUse | null = null;

  previousState(): void {
    window.history.back();
  }
}
