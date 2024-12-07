import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IUnitOfUse } from '../unit-of-use.model';
import { UnitOfUseService } from '../service/unit-of-use.service';

@Component({
  standalone: true,
  templateUrl: './unit-of-use-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class UnitOfUseDeleteDialogComponent {
  unitOfUse?: IUnitOfUse;

  protected unitOfUseService = inject(UnitOfUseService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.unitOfUseService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
