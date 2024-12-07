import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IImplementationResult } from '../implementation-result.model';
import { ImplementationResultService } from '../service/implementation-result.service';

@Component({
  standalone: true,
  templateUrl: './implementation-result-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ImplementationResultDeleteDialogComponent {
  implementationResult?: IImplementationResult;

  protected implementationResultService = inject(ImplementationResultService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.implementationResultService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
