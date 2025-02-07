import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IImplementationResult } from '../implementation-result.model';

@Component({
  standalone: true,
  selector: 'jhi-implementation-result-detail',
  templateUrl: './implementation-result-detail.component.html',
  styleUrls: ['../../shared.component.css'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ImplementationResultDetailComponent {
  @Input() implementationResult: IImplementationResult | null = null;

  previousState(): void {
    window.history.back();
  }
}
