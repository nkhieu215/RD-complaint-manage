import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IComplaint } from '../complaint.model';
import { ComplaintService } from '../service/complaint.service';

@Component({
  standalone: true,
  templateUrl: './complaint-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ComplaintDeleteDialogComponent {
  complaint?: IComplaint;

  protected complaintService = inject(ComplaintService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.complaintService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
