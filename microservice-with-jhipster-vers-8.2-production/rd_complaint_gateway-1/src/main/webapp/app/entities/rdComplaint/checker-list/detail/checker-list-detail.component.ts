import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ICheckerList } from '../checker-list.model';

@Component({
  standalone: true,
  selector: 'jhi-checker-list-detail',
  templateUrl: './checker-list-detail.component.html',
  styleUrls: ['../../shared.component.css'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class CheckerListDetailComponent {
  @Input() checkerList: ICheckerList | null = null;

  previousState(): void {
    window.history.back();
  }
}
