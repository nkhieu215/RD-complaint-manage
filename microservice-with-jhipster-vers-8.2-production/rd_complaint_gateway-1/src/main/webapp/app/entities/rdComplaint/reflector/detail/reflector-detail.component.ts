import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IReflector } from '../reflector.model';

@Component({
  standalone: true,
  selector: 'jhi-reflector-detail',
  templateUrl: './reflector-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ReflectorDetailComponent {
  @Input() reflector: IReflector | null = null;

  previousState(): void {
    window.history.back();
  }
}
