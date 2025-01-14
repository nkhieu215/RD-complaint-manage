import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IComplaintList } from '../complaint-list.model';
import { ComplaintListService } from '../service/complaint-list.service';

@Component({
  standalone: true,
  templateUrl: './complaint-list-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ComplaintListDeleteDialogComponent {
  complaintList?: IComplaintList;

  protected complaintListService = inject(ComplaintListService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.complaintListService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
