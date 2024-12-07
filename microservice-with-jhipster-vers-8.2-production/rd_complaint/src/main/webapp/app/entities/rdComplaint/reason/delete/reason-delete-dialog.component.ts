import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IReason } from '../reason.model';
import { ReasonService } from '../service/reason.service';

@Component({
  standalone: true,
  templateUrl: './reason-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ReasonDeleteDialogComponent {
  reason?: IReason;

  protected reasonService = inject(ReasonService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.reasonService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
