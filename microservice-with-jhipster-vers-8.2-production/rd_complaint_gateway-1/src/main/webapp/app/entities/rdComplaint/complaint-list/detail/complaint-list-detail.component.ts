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
import { faDownload, faPlus, faUpload, faSave, faRedo, faImage, faTrash } from '@fortawesome/free-solid-svg-icons';
import { error } from 'console';
import { ListOfErrorService } from '../../list-of-error/service/list-of-error.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
@Component({
  standalone: true,
  selector: 'jhi-complaint-list-detail',
  templateUrl: './complaint-list-detail.component.html',
  styleUrls: ['./complaint-list-detail.component.css', '../complaint-list.component.css'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe, FormsModule, NzTableModule, NzToolTipModule],
})
export class ComplaintListDetailComponent implements OnInit {
  //upload file
  currentFile: any;
  faPlus = faPlus;
  faRedo = faRedo;
  faSave = faSave;
  faImage = faImage;
  faUpload = faUpload;
  faTrash = faTrash;
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
  errorList: any[] = [];
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
  today: string = new Date().toISOString().split('T')[0];
  protected modalService = inject(NgbModal);
  protected complaintListService = inject(ComplaintListService);
  protected listOfErrorService = inject(ListOfErrorService);
  protected accountService = inject(AccountService);
  protected actRoute = inject(ActivatedRoute);
  protected sanitizer = inject(DomSanitizer);
  ngOnInit(): void {
    // this.accountService.identity().subscribe(account => this.account.set(account));
    var id = this.actRoute.snapshot.params['id'];
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
      this.errorList = res.errorLists;
      setTimeout(() => {
        //convert date
        this.complaintDetail.rectification_time = this.complaintDetail.rectification_time === null ? null : this.complaintDetail.rectification_time.slice(0, 10);
        //mapping name by id
        var reflector = res.reflectorList.find((x: any) => x.id === res.complaintListDTOById.reflector_id);
        var checker = res.checkerLists.find((x: any) => x.id === res.complaintListDTOById.check_by_id);
        var department = res.departmentList.find((x: any) => x.id === res.complaintListDTOById.dapartment_id);
        var implementationResult = res.implementationResultList.find((x: any) => x.id === res.complaintListDTOById.implementation_result_id);
        var complaint = res.complaintList.find((x: any) => x.id === res.complaintListDTOById.complaint_id);
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
        //mapping name by id of listoferror
        this.listOfError.forEach((element: any) => {
          element.check_time = element.check_time.slice(0, 10);
          var reason = this.reasonList.find((x: any) => x.id === element.reason_id);
          var check_by = this.checkerLists.find((x: any) => x.id === element.check_by_id);
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
        console.log('a', this.complaintDetail);
      }, 500);
      console.log(res);
    })
  }


  previousState(): void {
    window.history.back();
  }

  validateReflector(value: string): boolean {
    console.log('listReflector', this.reflectorLists)
    return this.reflectorLists.some(item => item.name === value);
  }

  validateNameListComplaint(value: string): boolean {
    return this.complaintLists.some(item => item.name === value);
  }

  validateDepartment(value: string): boolean {
    return this.departmentList.some(item => item.name === value);
  }

  validateErrorCode(value: string): boolean {
    return this.errorList.some(item => item.attributeKey === value);
  }

  validateErrorName(value: string): boolean {
    return this.errorList.some(item => item.errName === value);
  }

  validateReason(value: string): boolean {
    return this.reasonList.some(item => item.name === value);
  }

  validateChecker(value: string): boolean {
    return this.checkerLists.some(item => item.name === value);
  }

  validateImplementationResult(value: string): boolean {
    return this.implementationResultList.some(item => item.name === value);
  }

  onChange(event: any): void {
    this.showImage = true;
    const file = event.target.files[0];
    this.currentFile = file;
    this.listOfError[this.indexImageError].image = event.target.files[0].name;
    this.imageSrc = window.URL.createObjectURL(file);
    console.log(event);
  }
  downloadImage() {
    this.complaintListService.uploadImage(this.currentFile).subscribe(() => {
      this.saveComplaintDetail('update');
      // this.listOfErrorService.updateListOfError(this.listOfError).subscribe();
      // Swal.fire({
      //   title: 'Thành công',
      //   text: 'Lưu ảnh thành công',
      //   icon: 'success',
      //   showCancelButton: false,
      //   showConfirmButton: false,
      //   timer: 2000
      // })
    });
  }
  updateIdMapping() {
    //convert datetime
    this.complaintDetail.production_time = new Date(this.complaintDetail.production_time);
    this.complaintDetail.rectification_time = this.complaintDetail.rectification_time === null ? null : new Date(this.complaintDetail.rectification_time);
    this.complaintDetail.updated_at = new Date();
    // mapping id by name
    var reflector = this.reflectorLists.find((x: any) => x.name === this.complaintDetail.reflector);
    var checker = this.checkerLists.find((x: any) => x.name === this.complaintDetail.checker);
    var department = this.departmentList.find((x: any) => x.name === this.complaintDetail.department);
    var implementationResult = this.implementationResultList.find((x: any) => x.name === this.complaintDetail.implementation_result);
    var complaint = this.complaintLists.find((x: any) => x.name === this.complaintDetail.complaint);
    var unit_of_use = this.unitOfUseList.find((x: any) => x.name === this.complaintDetail.unit_of_use);
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
    //mapping id by name of listoferror
    this.listOfError.forEach((element: any) => {
      element.check_time = element.check_time === null ? new Date() : new Date(element.check_time);
      element.updated_at = new Date();
      var reason = this.reasonList.find((x: any) => x.name === element.reason);
      var check_by = this.checkerLists.find((x: any) => x.name === element.check_by);
      console.log('check-by', check_by)
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
  async saveComplaintDetail(mss: any) {
    await this.updateIdMapping()
    this.complaintListService.updateComplaintInfo(this.complaintDetail).subscribe();
    this.listOfErrorService.updateListOfError(this.listOfError).subscribe();
    console.log(this.complaintDetail);
    Swal.fire({
      title: 'Thành công',
      text: 'Cập nhật thông tin thành công',
      icon: 'success',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
      timer: 5000
    }).then(async (result) => {
      if (result.value && mss === 'reload') {
        window.location.reload();
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }

  //   async saveComplaintDetail(mss: any) {
  //     // Kiểm tra validation trước khi lưu
  //     const validation = this.validateInputs();
  //     if (!validation.isValid) {
  //         Swal.fire({
  //             title: 'Thông báo',
  //             html: `
  //                 <div style="text-align: left">
  //                     <p>Vui lòng điền đầy đủ thông tin cho các trường sau:</p>
  //                     <ul style="color: #dc3545">
  //                         ${validation.emptyFields.map(field => `<li>${field}</li>`).join('')}
  //                     </ul>
  //                 </div>
  //             `,
  //             icon: 'warning',
  //             confirmButtonText: 'Đồng ý'
  //         });
  //         return;
  //     }

  //     await this.updateIdMapping();

  //     forkJoin([
  //         this.complaintListService.updateComplaintInfo(this.complaintDetail),
  //         this.listOfErrorService.updateListOfError(this.listOfError)
  //     ]).subscribe({
  //         next: () => {
  //             Swal.fire({
  //                 title: 'Thành công',
  //                 text: 'Cập nhật thông tin thành công',
  //                 icon: 'success',
  //                 showCancelButton: true,
  //                 showConfirmButton: true,
  //                 confirmButtonText: 'Đồng ý',
  //                 cancelButtonText: 'Hủy',
  //                 timer: 5000
  //             }).then(async (result) => {
  //                 if (result.value && mss === 'reload') {
  //                     window.location.reload();
  //                 }
  //             });
  //         },
  //         error: (error) => {
  //             Swal.fire({
  //                 title: 'Lỗi',
  //                 text: 'Không thể cập nhật thông tin',
  //                 icon: 'error',
  //                 confirmButtonText: 'Đồng ý'
  //             });
  //         }
  //     });
  // }

  addNewRow(): void {
    const newItem = {
      error_code: null,
      error_name: null,
      quantity: 0,
      error_source: null,
      led_infor: null,
      driver_infor: null,
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
  openPopupError(content: any, imageName: any, index: any, type: any): void {
    if (type === 'view') {
      this.imageSrc = '../../../../../content/images/ErrorImage/' + imageName;
    } else {
      this.imageSrc = '../../../../../content/images/ErrorImage/' + imageName;
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
  errorPopup(message: any): void {
    this.savingProcess = false;
    Swal.fire({
      title: 'Cảnh báo',
      text: message + ' không nằm trong danh mục quản lý',
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
  updateTotalError(): void {
    this.complaintDetail.total_errors = 0;
    this.listOfError.forEach((element: any) => {
      // console.log(this.complaintDetail.total_errors, element.quantity)
      this.complaintDetail.total_errors += element.quantity;
    });
  }

  showTooltip(imageName: string, event: MouseEvent): void {
    this.tooltipContent = '../../../../../content/images/ErrorImage/' + imageName;
    this.tooltipVisible = true;
    this.tooltipPosition = { top: event.clientY + 'px', left: event.clientX + 'px' };
  }

  hideTooltip(): void {
    this.tooltipVisible = false;
  }

  openToast(): void {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Đã xoá thông tin thành công"
    });
  }

  updateErrorValue(index: any, error_code: any, error_name: any): void {
    var result = this.errorList.find(x => x.attributeKey === error_code || x.errName === error_name);
    console.log(result, error_code, error_name)
    if (result) {
      this.listOfError[index].error_code = result.attributeKey;
      this.listOfError[index].error_name = result.errName;
    } else {
      Swal.fire({
        title: 'Thông báo',
        text: 'Không tìm thấy thông tin lỗi',
        icon: 'warning',
        showCancelButton: false,
        showConfirmButton: false,
        timer: 2000
      })
    }
  }

  isNumberKey(event: KeyboardEvent): boolean {
    if (event.code === 'Backspace' || event.code === 'Delete' ||
      event.code === 'ArrowLeft' || event.code === 'ArrowRight' ||
      event.code === 'Tab') {
      return true;
    }
    if (event.key === '.' || event.key === '-' || event.key === ',') {
      return false;
    }
    const isNumber = /^[0-9]$/.test(event.key);
    if (isNumber) {
      const input = event.target as HTMLInputElement;
      const newValue = input.value + event.key;
      return parseInt(newValue, 10) > 0;
    }
    return false;
  }

  cannotTypingInput(event: KeyboardEvent): boolean {
    event.preventDefault();
    return false;
  }

  // deleteRow(index: number): void {
  //   this.listOfError.splice(index, 1);
  //   const Toast = Swal.mixin({
  //     toast: true,
  //     position: "top-end",
  //     showConfirmButton: false,
  //     timer: 3000,
  //     timerProgressBar: true,
  //     didOpen: (toast) => {
  //       toast.onmouseenter = Swal.stopTimer;
  //       toast.onmouseleave = Swal.resumeTimer;
  //     }
  //   });
  //   Toast.fire({
  //     icon: "success",
  //     title: "Đã xoá thông tin thành công"
  //   });
  // }

  async deleteRow(index: number): Promise<any> {
    await this.updateIdMapping();
    await this.updateTotalError();

    const itemToDelete = this.listOfError[index];

    this.listOfErrorService.deleteError(itemToDelete.id).subscribe(
      () => {
        this.listOfError.splice(index, 1);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          // timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Đã xoá thông tin thành công"
        });

        // this.complaintListService.updateComplaintInfo(this.complaintDetail).subscribe();
        console.log(this.complaintDetail);
      }
    );
  }

  validateInputs(): { isValid: boolean; emptyFields: string[] } {
    const emptyFields: string[] = [];

    if (!this.complaintDetail.product_code) { emptyFields.push('Mã sản phẩm') };
    if (!this.complaintDetail.reflector) { emptyFields.push('Người khiếu nại') };
    if (!this.complaintDetail.complaint) { emptyFields.push('Hình thức khiếu nại') };
    if (!this.complaintDetail.department) { emptyFields.push('Đơn vị phối hợp') };
    if (!this.complaintDetail.implementation_result) { emptyFields.push('Kết quả thực hiện') };

    this.listOfError.forEach((error, index) => {
      if (!error.error_code) { emptyFields.push(`Mã lỗi (dòng ${index + 1})`) };
      if (!error.error_name) { emptyFields.push(`Tên lỗi (dòng ${index + 1})`) };
      if (!error.lot_number) { emptyFields.push(`Mã lot (dòng ${index + 1})`) };
      if (!error.serial) { emptyFields.push(`Serial (dòng ${index + 1})`) };
      if (!error.mac_address) { emptyFields.push(`Địa chỉ mac (dòng ${index + 1})`) };
      if (!error.quantity) { emptyFields.push(`Số lượng (dòng ${index + 1})`) };
      if (!error.error_source) { emptyFields.push(`Phân loại nguồn lỗi (dòng ${index + 1})`) };
      if (!error.reason) { emptyFields.push(`Nguyên nhân (dòng ${index + 1})`) };
      if (!error.method) { emptyFields.push(`Biện pháp khắc phục (dòng ${index + 1})`) };
      if (!error.check_by) { emptyFields.push(`Người kiểm tra (dòng ${index + 1})`) };
      if (!error.check_time) { emptyFields.push(`Ngày kiểm tra (dòng ${index + 1})`) };
    });

    return {
      isValid: emptyFields.length === 0,
      emptyFields
    };
  }

  showValidationErrors(): void {
    const validation = this.validateInputs();
    if (!validation.isValid) {
      Swal.fire({
        title: 'Thông báo',
        html: `
        <div style="text-align: left">
          <p>Vui lòng điền đầy đủ thông tin cho các trường sau:</p>
          <ul>
            ${validation.emptyFields.map(field => `<li>${field}</li>`).join('')}
          </ul>
        </div>
      `,
        icon: 'warning',
        confirmButtonText: 'Đồng ý'
      });
    }
  }

}
