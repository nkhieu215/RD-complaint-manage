import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IComplaintList } from '../complaint-list.model';
import { FormsModule } from '@angular/forms';
import {
  NzTableModule,
} from 'ng-zorro-antd/table';
import Swal from 'sweetalert2';
import { ComplaintListService } from '../service/complaint-list.service';
import { faDownload, faPlus, faUpload, faSave, faRedo, faImage } from '@fortawesome/free-solid-svg-icons';
import { error } from 'console';
import { ListOfErrorService } from '../../list-of-error/service/list-of-error.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
@Component({
  standalone: true,
  selector: 'jhi-complaint-list-detail',
  templateUrl: './complaint-list-detail.component.html',
  styleUrls: ['./complaint-list-detail.component.css', '../complaint-list.component.css'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe, FormsModule, NzTableModule, NzToolTipModule],
})
export class ComplaintListDetailComponent implements OnInit {
  faPlus = faPlus;
  faRedo = faRedo;
  faSave = faSave;
  faImage = faImage;
  faUpload = faUpload;
  savingProcess = true;
  @Input() complaintDetail: any;
  listOfError: any[] = [];
  account = signal<Account | null>(null);
  // Danh sách gợi ý
  reflectorLists: any[] = [];
  checkerLists: any[] = [];
  complaintLists: any[] = [];
  complaintStatusList: any[] = [];
  departmentList: any[] = [];
  implementationResultList: any[] = [];
  reasonList: any[] = [];
  unitOfUseList: any[] = [];
  //show image
  indexImageError = 0;
  modalOptions: NgbModalOptions = {
    size: 'lg',
  };
  closeResult: string = '';
  showImage = false;
  imageSrc = '';
  // tooltip
  tooltipVisible = false;
  tooltipContent = '';
  tooltipPosition = { top: '0px', left: '0px' };
  protected modalService = inject(NgbModal);
  protected complaintListService = inject(ComplaintListService);
  protected listOfErrorService = inject(ListOfErrorService);
  protected accountService = inject(AccountService);
  protected actRoute = inject(ActivatedRoute);
  ngOnInit(): void {
    this.accountService.identity().subscribe(account => this.account.set(account));
    let id = this.actRoute.snapshot.params['id'];
    this.complaintListService.getErrorDetail(id).subscribe(res => {
      this.listOfError = res.listOfErrorList;
      this.complaintDetail = res.complaintListDTOById;
      this.reflectorLists = res.reflectorList;
      this.checkerLists = res.checkerLists;
      this.complaintLists = res.complaintList;
      this.complaintStatusList = res.complaintStatusList;
      this.departmentList = res.departmentList;
      this.implementationResultList = res.implementationResultList;
      this.reasonList = res.reasonList;
      this.unitOfUseList = res.unitOfUseList;
      setTimeout(() => {
        //convert date
        this.complaintDetail.production_time = this.complaintDetail.production_time == null ? null : this.complaintDetail.production_time.slice(0, 10);
        this.complaintDetail.rectification_time = this.complaintDetail.rectification_time == null ? null : this.complaintDetail.rectification_time.slice(0, 10);
        //mapping name by id
        let reflector = res.reflectorList.find((x: any) => x.id == res.complaintListDTOById.reflector_id);
        let checker = res.checkerLists.find((x: any) => x.id == res.complaintListDTOById.check_by_id);
        let department = res.departmentList.find((x: any) => x.id == res.complaintListDTOById.dapartment_id);
        let implementationResult = res.implementationResultList.find((x: any) => x.id == res.complaintListDTOById.implementation_result_id);
        let complaint = res.complaintList.find((x: any) => x.id == res.complaintListDTOById.complaint_id);
        let unit_of_use = res.unitOfUseList.find((x: any) => x.id == res.complaintListDTOById.unit_of_use_id);
        if (reflector) {
          this.complaintDetail.reflector = reflector.name;
        } else {
          this.complaintDetail.reflector = null;
        }
        if (department) {
          this.complaintDetail.department = department.name;
        } else {
          this.complaintDetail.department = null;
        }
        if (implementationResult) {
          this.complaintDetail.implementation_result = implementationResult.name;
        } else {
          this.complaintDetail.implementation_result = null;
        }
        if (complaint) {
          this.complaintDetail.complaint = complaint.name;
        } else {
          this.complaintDetail.complaint = null;
        }
        if (unit_of_use) {
          this.complaintDetail.unit_of_use = unit_of_use.name;
        } else {
          this.complaintDetail.unit_of_use = null;
        }
        //mapping name by id of listoferror
        this.listOfError.forEach((element: any) => {
          element.check_time = element.check_time.slice(0, 10);
          let reason = this.reasonList.find((x: any) => x.id == element.reason_id);
          let check_by = this.reasonList.find((x: any) => x.id == element.check_by_id);
          if (reason) {
            element.reason = reason.name;
          } else {
            element.reason = null;
          }
          if (check_by) {
            element.check_by = check_by.name;
          } else {
            element.check_by = null;
          }
        })
        console.log(this.complaintDetail);
      }, 500);
      console.log(res);
    })
  }
  previousState(): void {
    window.history.back();
  }
  onChange(event: any): void {
    this.showImage = true;
    const file = event.target.files[0];
    if (file) {
      this.listOfError[this.indexImageError].image = file.name
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc = e.target.result;
      }
      reader.readAsDataURL(file)
    }
    // this.listOfError[this.indexImageError].image = event.target.files[0].name;
    // this.imageSrc += event.target.files[0].name;
    // console.log(this.listOfError[index].image);
  }
  updateIdMapping() {
    //convert datetime
    this.complaintDetail.production_time = new Date(this.complaintDetail.production_time);
    this.complaintDetail.rectification_time = this.complaintDetail.rectification_time == null ? null : new Date(this.complaintDetail.rectification_time);
    this.complaintDetail.updated_at = new Date();
    // mapping id by name
    let reflector = this.reflectorLists.find((x: any) => x.name == this.complaintDetail.reflector);
    let checker = this.checkerLists.find((x: any) => x.name == this.complaintDetail.checker);
    let department = this.departmentList.find((x: any) => x.name == this.complaintDetail.department);
    let implementationResult = this.implementationResultList.find((x: any) => x.name == this.complaintDetail.implementation_result);
    let complaint = this.complaintLists.find((x: any) => x.name == this.complaintDetail.complaint);
    let unit_of_use = this.unitOfUseList.find((x: any) => x.name == this.complaintDetail.unit_of_use);
    if (reflector) {
      this.complaintDetail.reflector_id = reflector.id;
    } else {
      this.complaintDetail.reflector_id = null;
      this.errorPopup('Người khiếu nại');
    }
    if (department) {
      this.complaintDetail.dapartment_id = department.id;
    }
    else {
      this.complaintDetail.dapartment_id = null;
      this.errorPopup('Đơn vị phối hợp');
    }
    if (implementationResult) {
      this.complaintDetail.implementation_result_id = implementationResult.id;
    } else {
      this.complaintDetail.implementation_result_id = null;
      this.errorPopup('Kết quả thực hiện');
    }
    if (complaint) {
      this.complaintDetail.complaint_id = complaint.id;
    } else {
      this.complaintDetail.complaint_id = null;
      this.errorPopup('Hình thức khiếu nại');
    }
    if (unit_of_use) {
      this.complaintDetail.unit_of_use_id = unit_of_use.id;
    } else {
      this.complaintDetail.unit_of_use_id = null;
      this.errorPopup('Đơn vị sử dụng');
    }
    //mapping id by name of listoferror
    this.listOfError.forEach((element: any) => {
      element.check_time = element.check_time == null ? new Date() : new Date(element.check_time);
      element.updated_at = new Date();
      let reason = this.reasonList.find((x: any) => x.name == element.reason);
      let check_by = this.reasonList.find((x: any) => x.name == element.check_by);
      if (reason) {
        element.reason_id = reason.id;
      } else {
        element.reason_id = null;
      }
      if (check_by) {
        element.check_by_id = check_by.id;
      } else {
        element.check_by_id = null;
      }
    })
  }
  async saveComplaintDetail() {
    await this.updateIdMapping()
    this.complaintListService.updateComplaintInfo(this.complaintDetail).subscribe();
    this.listOfErrorService.updateListOfError(this.listOfError).subscribe();
    console.log(this.complaintDetail);
    Swal.fire({
      title: 'Thành công',
      text: 'Cập nhật thông tin thành công',
      icon: 'success',
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.value) {
        window.location.reload();
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }
  addNewRow() {
    const newItem = {
      error_code: null,
      error_name: null,
      quantity: 0,
      error_source: null,
      reason_id: null,
      reason: null,
      check_by_id: null,
      check_by: null,
      method: null,
      check_time: null,
      image: null,
      created_at: new Date(),
      updated_at: new Date(),
      complaint_id: this.complaintDetail.id,
      lot_number: null,
      serial: null,
      mac_address: null,
    }
    this.listOfError = [newItem, ... this.listOfError];
  }
  openPopupError(content: any, imageName: any, index: any, type: any) {
    if (type == 'view') {
      this.imageSrc = '../../../../../content/images/ErrorImage/' + imageName;
    } else {
      this.imageSrc = imageName;
      this.indexImageError = index;
    }
    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  errorPopup(message: any) {
    this.savingProcess = false;
    Swal.fire({
      title: 'Cảnh báo',
      text: message + 'không nằm trong danh mục quản lý',
      icon: 'warning',
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.value) {
        this.savingProcess = true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }
  updateTotalError() {
    this.complaintDetail.total_errors = 0;
    this.listOfError.forEach((element: any) => {
      // console.log(this.complaintDetail.total_errors, element.quantity)
      this.complaintDetail.total_errors += element.quantity;
    });
  }

  showTooltip(event: MouseEvent, complaintDetail: any): void {
    this.tooltipContent = `Thông tin tooltip: ${this.complaintDetail.comment}`;
    this.tooltipVisible = true;
    this.tooltipPosition = {
      top: `${event.clientY}px`,
      left: `${event.clientX}px`
    };
    console.warn('content', this.tooltipContent)
    console.warn('vi tri', this.tooltipPosition)

  }

  hideTooltip(): void {
    this.tooltipVisible = false;
  }
}
