import { Component, NgZone, inject, OnInit, Input } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as exceljs from 'exceljs';
import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ItemCountComponent } from 'app/shared/pagination';
import { FormBuilder, FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { IComplaintList } from '../complaint-list.model';
import { EntityArrayResponseType, ComplaintListService } from '../service/complaint-list.service';
import { ComplaintListDeleteDialogComponent } from '../delete/complaint-list-delete-dialog.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableModule,
  NzTableSortFn,
  NzTableSortOrder
} from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import Swal from 'sweetalert2';
@Component({
  standalone: true,
  selector: 'jhi-complaint-list',
  templateUrl: './complaint-list.component.html',
  styleUrls: ['../complaint-list.component.css'],
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    ItemCountComponent,
    NzButtonModule,
    NzDividerModule,
    NzTableModule,
    NzToolTipModule,
    NzPaginationModule,
  ],
})
export class ComplaintListComponent implements OnInit {
  subscription: Subscription | null = null;
  complaintLists: any[] = [];
  complaintListsOrigin?: any[];
  isLoading = false;
  sortState = sortStateSignal({});
  filteredComplaints: any[] = [];
  // ---------------------------- key search -----------------//
  @Input() product_code = ' ';
  @Input() product_name = ' ';
  @Input() lot_number = ' ';
  @Input() branch = ' ';
  @Input() reflector = ' ';
  @Input() department = ' ';
  @Input() checker = ' ';
  @Input() create_by = ' ';
  @Input() status = ' ';
  @Input() unit_of_use = ' ';
  @Input() implementation_result = ' ';
  @Input() complaint = ' ';
  @Input() serial = ' ';
  @Input() report_code = ' ';
  // ---------------------------------------------------------//
  itemsPerPage = 10;
  totalItems = 0;
  page = 1;
  current = 1;
  filteredComplaintLists: any[] = [];
  protected router = inject(Router);
  protected complaintListService = inject(ComplaintListService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);
  constructor(
    protected fb: FormBuilder
  ) { }

  trackId = (_index: number, item: IComplaintList): number => this.complaintListService.getComplaintListIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => this.load()),
      )
      .subscribe();
    this.totalItems = this.complaintLists.length;
    this.filteredComplaints = this.filterComplaints(this.complaintLists, {
      product_code: this.product_code,
      product_name: this.product_name,
      branch: this.branch,
      reflector: this.reflector,
      department: this.department,
      checker: this.checker,
      create_by: this.create_by,
      status: this.status,
      unit_of_use: this.unit_of_use,
      implementation_result: this.implementation_result,
      complaint: this.complaint
    });
    this.updateTableData(this.complaintListsOrigin);
    console.log('list item', this.complaintLists)
  }

  trackById(index: number, item: any): any {
    return item.id || index;
  }

  //convert key when undefine
  checkSearchKey() {
    if (this.product_code === undefined || this.product_code === null) {
      this.product_code = '';
    }
    if (this.product_name === undefined || this.product_name === null) {
      this.product_name = '';
    }
    if (this.report_code === undefined || this.report_code === null) {
      this.report_code = '';
    }
    if (this.branch === undefined || this.branch === null) {
      this.branch = '';
    }
    if (this.reflector === undefined || this.reflector === null) {
      this.reflector = '';
    }
    if (this.department === undefined || this.department === null) {
      this.department = '';
    }
    if (this.checker === undefined || this.checker === null) {
      this.checker = '';
    }
    if (this.create_by === undefined || this.create_by === null) {
      this.create_by = '';
    }
    if (this.status === undefined || this.status === null) {
      this.status = '';
    }
    if (this.unit_of_use === undefined || this.unit_of_use === null) {
      this.unit_of_use = '';
    }
    if (this.implementation_result === undefined || this.implementation_result === null) {
      this.implementation_result = '';
    }
    if (this.complaint === undefined || this.complaint === null) {
      this.complaint = '';
    }
  }
  // tìm kiếm
  async search() {
    await this.checkSearchKey();
    console.log('tên sp:', this.product_name)
    console.log('mã sp:', this.product_code)
    console.log('report_code:', this.report_code)
    console.log('branch:', this.branch)
    console.log('reflector:', this.reflector)
    console.log('department:', this.department)
    console.log('checker:', this.checker)
    console.log('create_by:', this.create_by)
    console.log('status:', this.status)
    console.log('unit_of_use:', this.unit_of_use)
    console.log('implementation_result:', this.implementation_result)
    console.log('complaint:', this.complaint)

    setTimeout(() => {
      this.complaintLists = this.complaintListsOrigin!.filter(x => x.product_name.includes(this.product_name)
        && x.product_code.includes(this.product_code)
        && x.report_code.includes(this.report_code)
        && x.branch.includes(this.branch)
        && x.reflector.includes(this.reflector)
        && x.department.includes(this.department)
        && x.checker.includes(this.checker)
        && x.create_by.includes(this.create_by)
        && x.status.includes(this.status)
        && x.unit_of_use.includes(this.unit_of_use)
        && x.implementation_result.includes(this.implementation_result)
        && x.complaint.includes(this.complaint)
      );
    }, 500);
  }

  filterComplaints(complaints: any[], filters: any): any[] {
    console.warn('chay')
    return complaints.filter(complaint =>
      (!filters.product_code || complaint.product_code?.toLowerCase().includes(filters.product_code.toLowerCase())) &&
      (!filters.product_name || complaint.product_name?.toLowerCase().includes(filters.product_name.toLowerCase())) &&
      (!filters.report_code || complaint.report_code?.toLowerCase().includes(filters.report_code.toLowerCase())) &&
      (!filters.branch || complaint.branch?.toLowerCase().includes(filters.branch.toLowerCase())) &&
      (!filters.reflector || complaint.reflector?.toLowerCase().includes(filters.reflector.toLowerCase())) &&
      (!filters.department || complaint.department?.toLowerCase().includes(filters.department.toLowerCase())) &&
      (!filters.checker || complaint.checker?.toLowerCase().includes(filters.checker.toLowerCase())) &&
      (!filters.create_by || complaint.create_by?.toLowerCase().includes(filters.create_by.toLowerCase())) &&
      (!filters.status || complaint.status?.toLowerCase().includes(filters.status.toLowerCase())) &&
      (!filters.unit_of_use || complaint.unit_of_use?.toLowerCase().includes(filters.unit_of_use.toLowerCase())) &&
      (!filters.implementation_result || complaint.implementation_result?.toLowerCase().includes(filters.implementation_result.toLowerCase())) &&
      (!filters.complaint || complaint.complaint?.toLowerCase().includes(filters.complaint.toLowerCase()))
    );
  }

  updateTableData(listDataChange: any): void {
    const startIndex = (this.current - 1) * this.itemsPerPage;
    const endIndex = this.current * this.itemsPerPage;
    this.complaintLists = listDataChange!.slice(startIndex, endIndex) || [];
    console.log('startIndex', startIndex)
  }

  search2(): void {
    this.filteredComplaintLists = [...this.complaintLists];
    this.filteredComplaintLists = this.complaintListsOrigin!.filter(item => {
      this.totalItems = this.complaintLists.length;
      return (
        (!this.product_code || item.product_code.includes(this.product_code)) &&
        (!this.product_name || item.product_name.includes(this.product_name)) &&
        (!this.branch || item.branch.includes(this.branch)) &&
        (!this.reflector || item.reflector.includes(this.reflector)) &&
        (!this.department || item.department.includes(this.department)) &&
        (!this.checker || item.checker.includes(this.checker)) &&
        (!this.create_by || item.create_by.includes(this.create_by)) &&
        (!this.status || item.status.includes(this.status)) &&
        (!this.unit_of_use || item.unit_of_use.includes(this.unit_of_use)) &&
        (!this.implementation_result || item.implementation_result.includes(this.implementation_result)) &&
        (!this.complaint || item.complaint.includes(this.complaint))
      );

    });
    this.totalItems = this.filteredComplaintLists.length;
    // this.complaintLists = this.filteredComplaintLists;
    setTimeout(() => {
      this.updateTableData(this.filteredComplaintLists)
    }, 500);
  }

  loadAll(): void {
    this.complaintListService.query().subscribe(
      (res: HttpResponse<IComplaintList[]>) => {
        this.complaintLists = res.body || [];
        this.filteredComplaintLists = [...this.complaintLists];
      }
    );
  }

  delete(complaintList: IComplaintList): void {
    // const modalRef = this.modalService.open(ComplaintListDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    // modalRef.componentInstance.complaintList = complaintList;
    // // unsubscribe not needed because closed completes on modal close
    // modalRef.closed
    //   .pipe(
    //     filter(reason => reason === ITEM_DELETED_EVENT),
    //     tap(() => this.load()),
    //   )
    //   .subscribe();

    Swal.fire({
      title: "Bạn có chắc chắn muốn xoá?",
      text: "Bạn sẽ không thể hoàn khôi phục lại thông tin này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xoá"
    }).then((result) => {
      if (result.isConfirmed) {
        this.complaintListService.delete(complaintList.id).subscribe(() => {
          Swal.fire({
            title: "Xoá!",
            text: "Bạn đã xoá thông tin thành công",
            icon: "success"
          });
          this.load()

        }, error => {
          Swal.fire({
            title: "Lỗi!",
            text: "Xoá thất bại",
            icon: "error"
          });
        })
      }
    });
  }

  // load(): void {
  //   this.complaintListService.getAll().subscribe(res => {
  //     console.log('danh sách lấy từ sv', res)
  //     this.complaintLists = this.complaintListsOrigin = res.complaintListResponseList.filter((x: any) => x.id != null);
  //     console.log('danh sách dữ liệu', this.complaintLists)
  //   })
  //   // this.queryBackend().subscribe({
  //   //   next: (res: EntityArrayResponseType) => {
  //   //     this.onResponseSuccess(res);
  //   //   },
  //   // });
  // }

  load(): void {
    this.complaintListService.getAll().subscribe(res => {
      console.log('danh sách lấy từ sv', res)
      this.complaintLists = this.complaintListsOrigin = res.complaintListResponseList.filter((x: any) => x.id != null);
      this.totalItems = this.complaintLists.length
      this.updateTableData(this.complaintListsOrigin);
      console.log('danh sách dữ liệu', this.complaintLists)
    })
  }

  // get displayData(): IComplaintList[] {
  //   const start = (this.current - 1) * this.itemsPerPage;
  //   return this.complaintLists.slice(start, start + this.itemsPerPage);
  // }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(this.page, event);
  }

  // navigateToPage(page: number): void {
  //   this.handleNavigation(page, this.sortState());
  // }

  navigateToPage(page: number): void {
    this.current = page;
    this.updateTableData(this.complaintListsOrigin);
    console.log('current navigateToPage', this.current)
    // console.log('update table data', this.updateTableData)

  }

  navigateToPage2(page: number): void {
    this.current = page;
    this.loadPage(page);
  }

  // onPageSizeChange(pageSize: number): void {
  //   this.itemsPerPage = pageSize;
  //   this.current = 1;
  //   this.loadPage(1);
  // }

  onPageSizeChange(pageSize: number): void {
    this.itemsPerPage = pageSize;
    this.loadPage(this.current)
    console.log('itemsPerPage', this.itemsPerPage)
    // console.log('loadPage', this.loadPage)

  }

  // loadPage(page: number): void {
  //   const queryObject = {
  //     page: page - 1,
  //     size: this.itemsPerPage,
  //   };
  //   this.complaintListService.query(queryObject).subscribe(
  //     response => {
  //       this.complaintLists = response.body ?? [];
  //       this.totalItems = Number(response.headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  //       this.updatePagination();
  //     }
  //   );
  // }

  updatePagination(): void {
    // this.totalItems = this.complaintLists.length;
    this.totalItems = this.complaintListsOrigin?.length ?? 0;
  }

  trackByFn(index: number, item: IComplaintList): number {
    // return item.id || index;
    return item.id;
  }

  loadPage(page: number): void {
    const queryObject = {
      page: page - 1,
      size: this.itemsPerPage,
    };
    this.complaintListService.query(queryObject).subscribe(
      response => {
        if (response.body) {
          this.complaintLists = response.body;
          this.totalItems = Number(response.headers.get(TOTAL_COUNT_RESPONSE_HEADER));
        }
        this.updatePagination();
      }
    );
  }


  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.complaintLists = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IComplaintList[] | null): IComplaintList[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    const { page } = this;

    this.isLoading = true;
    const pageToLoad: number = page;
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.complaintListService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page: number, sortState: SortState): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }


}
