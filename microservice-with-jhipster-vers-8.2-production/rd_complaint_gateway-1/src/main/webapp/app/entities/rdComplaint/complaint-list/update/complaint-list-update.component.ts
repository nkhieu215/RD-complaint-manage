import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as exceljs from 'exceljs';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { IComplaintList } from '../complaint-list.model';
import { ComplaintListService } from '../service/complaint-list.service';
import { ComplaintListFormService, ComplaintListFormGroup } from './complaint-list-form.service';
import { faDownload, faPlus, faUpload, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { BrowserModule } from '@angular/platform-browser';
import { saveAs } from 'file-saver'
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableModule,
  NzTableSortFn,
  NzTableSortOrder
} from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule, NzPlacementType } from 'ng-zorro-antd/dropdown';
import { BrowserModule } from '@angular/platform-browser';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
@Component({
  standalone: true,
  selector: 'jhi-complaint-list-update',
  templateUrl: './complaint-list-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule,
    NzTableModule, NzButtonModule, NzDropDownModule, MatAutocompleteModule
  ],
  styleUrls: ['./complaint-list-update.component.css', '../complaint-list.component.css'],
})
export class ComplaintListUpdateComponent implements OnInit {
  @Input() itemResult: any;
  faDownload = faDownload;
  faPlus = faPlus;
  faUpload = faUpload;
  faSave = faSave;
  faTrash = faTrash;
  isSaving = false;
  savingProcess = true;
  loading = false;
  // complaintList: IComplaintList | null = null;
  complaintLists: any[] = [];
  account: Account | null = null;
  //lưu thông tin import
  ExcelData: any;
  //list danh sách gợi ý
  listReflector: any[] = [];
  listComplaint: any[] = [];
  listUnitOfUse: any[] = [];
  listItem: any[] = [];
  listItemOrigin: any[] = [];
  today: string = new Date().toISOString().split('T')[0];
  protected complaintListService = inject(ComplaintListService);
  protected complaintListFormService = inject(ComplaintListFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected accountService = inject(AccountService);
  protected router = inject(Router);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ComplaintListFormGroup = this.complaintListFormService.createComplaintListFormGroup();

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => this.account = account);
    this.complaintListService.getGuideListInsert().subscribe(res => {
      console.log("list guide:", this.account)
      console.log("res:", res)
      console.log("res", res.itemList)

      this.listComplaint = res.complaintList;
      this.listReflector = res.reflectorList;
      this.listUnitOfUse = res.unitOfUseList;
      this.listItemOrigin = res.itemList
    });

    // this.activatedRoute.data.subscribe(({ complaintList }) => {
    //   this.complaintList = complaintList;
    //   if (complaintList) {
    //     this.updateForm(complaintList);
    //   }
    // });
  }

  previousState(): void {
    window.history.back();
  }

  validateProductCode(value: string): boolean {
    return this.listItemOrigin.some(item => item.itemCode === value);
  }

  validateProductName(value: string): boolean {
    return this.listItemOrigin.some(item => item.itemName === value);
  }

  validateReflector(value: string): boolean {
    console.log('listReflector', this.listReflector)
    return this.listReflector.some(item => item.name === value);
  }

  validateNameListComplaint(value: string): boolean {
    return this.listComplaint.some(item => item.name === value);
  }

  save(): void {
    this.isSaving = true;
    const complaintList = this.complaintListFormService.getComplaintList(this.editForm);
    if (complaintList.id !== null) {
      this.subscribeToSaveResponse(this.complaintListService.update(complaintList));
    } else {
      this.subscribeToSaveResponse(this.complaintListService.create(complaintList));
    }
  }
  updateIdGuide() {
    this.complaintLists.forEach(x => {
      x.created_at = x.updated_at = new Date();
      x.production_time = new Date(x.production_time_convert);
      x.reflector_id = 0;
      x.complaint_id = 0;
      const reflector = this.listReflector.find(ref => ref.name === x.reflector);
      const complaint = this.listComplaint.find(ref => ref.name === x.complaint);
      if (reflector) {
        x.reflector_id = reflector.id;
      } else {
        this.savingProcess = false;
        Swal.fire({
          title: 'Cảnh báo',
          text: 'Người khiếu nại không nằm trong danh mục quản lý',
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
      if (complaint) {
        x.complaint_id = complaint.id;
      } else {
        this.savingProcess = false;
        Swal.fire({
          title: 'Cảnh báo',
          text: 'Hình thức khiếu nại không nằm trong danh mục quản lý',
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
    })
    console.log('check body insert: ', this.complaintLists);
  }
  async saveListComplaint() {
    const hasInvalidProducts = this.complaintLists.some(
      complaint => complaint.product_name && !this.validateProductName(complaint.product_name)
    );

    if (hasInvalidProducts) {
      Swal.fire({
        title: 'Cảnh báo',
        text: 'Vui lòng chọn sản phẩm từ danh sách có sẵn',
        icon: 'warning',
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
      });
      return;
    }
    if (this.complaintLists.length === 0) {
      Swal.fire({
        title: 'Cảnh báo',
        text: 'Vui lòng khai báo thông tin khiếu nại',
        icon: 'warning',
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
      }).then(async (result) => {
        if (result.value) {
        } else if (result.dismiss === Swal.DismissReason.cancel) {

        }
      })
    } else {
      await this.updateIdGuide();
      if (this.savingProcess === true) {
        this.complaintListService.insertComplaintInfo(this.complaintLists).subscribe(() => {
          Swal.fire({
            title: 'Thành công',
            text: 'Thêm mới thông tin khiếu nại thành công',
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
          }).then(async (result) => {
            if (result.value) {
              setTimeout(() => {
                this.router.navigate([
                  `/complaint-list`,
                  {},
                ]);
              }, 500);
            } else if (result.dismiss === Swal.DismissReason.cancel) { }
          })
        })
      }
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

  updateProduct(index: any, product_code: any, product_name: any, branch: any): void {

    if (product_code.length > 4) {
      this.listItem = this.listItemOrigin.filter(x => x.itemCode.includes(product_code));
      console.log('Tìm kiếm theo mã sản phẩm:', product_code, this.listItem);
    }
  }
  updateProductName(index: any, product_code: any, product_name: any, branch: any): void {
    if (product_name.length > 1) {
      this.listItem = this.listItemOrigin.filter(x => x.itemName.includes(product_name));
      console.log('Tìm kiếm theo tên sản phẩm:', product_name, this.listItem);
    }
  }

  onSelectedElectronic(index: any, selectedItem: any): void {
    if (selectedItem) {
      this.complaintLists[index].product_code = selectedItem.itemCode;
      this.complaintLists[index].product_name = selectedItem.itemName;
      this.complaintLists[index].branch = selectedItem.itemBranch;
      this.listItem = [];

    } else {
      this.complaintLists[index].product_code = '';
      this.complaintLists[index].product_name = '';
    }
    console.log('aaaaa', this.complaintLists)
  }
  exportExcel(): void {
    var dataHeader = [[
      'Mã sản phẩm',
      'Tên sản phẩm',
      'Ngành',
      'Ngày sản xuất',
      'Người khiếu nại',
      'Hình thức khiếu nại',
      'Mã biên bản',
      'Đơn vị sử dụng',
      'Số lượng nhận',
      'Số lượng báo lỗi',
      'Số lượng lắp đặt',
      'Nội dung khiếu nại',
    ]
    ];
    var body = [[
      "000123456",
      "Tên sản phẩm",
      "Ngành",
      "2024-05-20",
      "Người khiếu nại",
      "Hình thức khiếu nại",
      "Mã biên bản",
      "Đơn vị sử dụng",
      "0",
      "0",
      "0",
      "Nội dung khiếu nại",
    ]
    ];
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

    ws['!cols'] = [
      { width: 15, wch: 15 },
      { width: 20, wch: 20 },
      { width: 15, wch: 15 },
      { width: 15, wch: 15 },
      { width: 20, wch: 20 },
      { width: 20, wch: 20 },
      { width: 15, wch: 15 },
      { width: 20, wch: 20 },
      { width: 15, wch: 15 },
      { width: 30, wch: 30 }
    ]
    XLSX.utils.sheet_add_aoa(ws, dataHeader, { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(ws, body, { origin: 'A2' });

    for (let i = 0; i < 10; i++) {
      const col = String.fromCharCode(65 + i);
      for (let j = 1; j <= 1000; j++) {
        if (!ws[`${col}${j}`]) {
          ws[`${col}${j}`] = { t: 's', v: '' };
        }
        ws[`${col}${j}`].z = '@';
      }
    }
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Thông tin khiếu nại');
    XLSX.writeFile(wb, 'Thông tin khiếu nại (file mẫu).xlsx');
  }
  //--------------------------------------------------- import file --------------------------------------------------------
  ReadExcel(event: any): void {
    this.ExcelData = this.complaintLists = [];
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = e => {
      const workBook = XLSX.read(fileReader.result, { type: 'binary' });
      const sheetNames = workBook.SheetNames;
      this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], {
        defval: '',
      });
      setTimeout(() => {
        this.ExcelData.forEach((element: any) => {
          const data = {
            product_code: element['Mã sản phẩm'],
            product_name: element['Tên sản phẩm'],
            report_code: element['Mã biên bản'],
            branch: element['Ngành'],
            reflector: element['Người khiếu nại'],
            quantity: element['Số lượng nhận'],
            production_time_convert: '2024-12-24',
            status: 'Chờ phân tích',
            complaint_detail: element['Nội dung khiếu nại'],
            unit_of_use: element['Đơn vị sử dụng'],
            complaint: element['Hình thức khiếu nại'],
            error_quantity: element['Số lượng báo lỗi'],
            used_quantity: element['Số lượng lắp đặt'],
            create_by: this.account?.login,
            total_errors: 0,
          };
          this.complaintLists.push(data);
        });
        console.log(this.complaintLists)
      }, 1000);
    };
  }
  addRow() {
    const data = {
      product_code: '',
      product_name: '',
      report_code: '',
      branch: '',
      reflector: '',
      quantity: '',
      error_quantity: '',
      used_quantity: '',
      production_time: '',
      status: 'Chờ phân tích',
      complaint_detail: '',
      unit_of_use: '',
      complaint: '',
      create_by: this.account?.login,
      total_errors: 0,
    };
    this.complaintLists = [data, ... this.complaintLists];
  }

  deleteRow(complaintList: any): void {
    const index = this.complaintLists.indexOf(complaintList)
    if (index > -1) {
      this.complaintLists.splice(index, 1)
    }
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComplaintList>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  // protected updateForm(complaintList: IComplaintList): void {
  //   this.complaintList = complaintList;
  //   this.complaintListFormService.resetForm(this.editForm, complaintList);
  // }
}
