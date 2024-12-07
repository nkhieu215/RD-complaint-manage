import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IComplaintList } from '../complaint-list.model';

@Component({
  standalone: true,
  selector: 'jhi-complaint-list-detail',
  templateUrl: './complaint-list-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ComplaintListDetailComponent {
  @Input() complaintList: IComplaintList | null = null;

  previousState(): void {
    window.history.back();
  }
}
