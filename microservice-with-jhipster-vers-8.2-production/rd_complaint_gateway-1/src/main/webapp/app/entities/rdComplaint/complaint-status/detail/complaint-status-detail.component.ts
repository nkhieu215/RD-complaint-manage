import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IComplaintStatus } from '../complaint-status.model';

@Component({
  standalone: true,
  selector: 'jhi-complaint-status-detail',
  templateUrl: './complaint-status-detail.component.html',
  styleUrls: ['../../shared.component.css'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ComplaintStatusDetailComponent {
  @Input() complaintStatus: IComplaintStatus | null = null;

  previousState(): void {
    window.history.back();
  }
}
