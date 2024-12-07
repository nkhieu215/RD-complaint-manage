import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IReflector } from '../reflector.model';
import { ReflectorService } from '../service/reflector.service';

@Component({
  standalone: true,
  templateUrl: './reflector-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ReflectorDeleteDialogComponent {
  reflector?: IReflector;

  protected reflectorService = inject(ReflectorService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.reflectorService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
