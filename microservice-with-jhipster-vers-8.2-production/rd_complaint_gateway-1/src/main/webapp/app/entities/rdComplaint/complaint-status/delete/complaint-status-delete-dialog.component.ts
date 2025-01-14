import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IComplaintStatus } from '../complaint-status.model';
import { ComplaintStatusService } from '../service/complaint-status.service';

@Component({
  standalone: true,
  templateUrl: './complaint-status-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ComplaintStatusDeleteDialogComponent {
  complaintStatus?: IComplaintStatus;

  protected complaintStatusService = inject(ComplaintStatusService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.complaintStatusService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
