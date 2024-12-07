import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IListOfError } from '../list-of-error.model';

@Component({
  standalone: true,
  selector: 'jhi-list-of-error-detail',
  templateUrl: './list-of-error-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ListOfErrorDetailComponent {
  @Input() listOfError: IListOfError | null = null;

  previousState(): void {
    window.history.back();
  }
}
