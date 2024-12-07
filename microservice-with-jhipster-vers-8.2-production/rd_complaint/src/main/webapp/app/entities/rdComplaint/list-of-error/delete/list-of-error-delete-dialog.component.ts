import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IListOfError } from '../list-of-error.model';
import { ListOfErrorService } from '../service/list-of-error.service';

@Component({
  standalone: true,
  templateUrl: './list-of-error-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ListOfErrorDeleteDialogComponent {
  listOfError?: IListOfError;

  protected listOfErrorService = inject(ListOfErrorService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.listOfErrorService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
