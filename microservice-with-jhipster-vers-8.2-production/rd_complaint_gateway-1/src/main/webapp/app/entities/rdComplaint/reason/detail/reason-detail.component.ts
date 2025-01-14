import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IReason } from '../reason.model';

@Component({
  standalone: true,
  selector: 'jhi-reason-detail',
  templateUrl: './reason-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ReasonDetailComponent {
  @Input() reason: IReason | null = null;

  previousState(): void {
    window.history.back();
  }
}
