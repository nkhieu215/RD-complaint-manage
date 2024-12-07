import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICheckerList } from '../checker-list.model';
import { CheckerListService } from '../service/checker-list.service';

@Component({
  standalone: true,
  templateUrl: './checker-list-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CheckerListDeleteDialogComponent {
  checkerList?: ICheckerList;

  protected checkerListService = inject(CheckerListService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.checkerListService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
