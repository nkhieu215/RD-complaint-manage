import { Component, NgZone, inject, OnInit, Input } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
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
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableModule,
  NzTableSortFn,
  NzTableSortOrder
} from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
@Component({
  standalone: true,
  selector: 'jhi-complaint-list',
  templateUrl: './complaint-list.component.html',
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
  ],
})
export class ComplaintListComponent implements OnInit {
  subscription: Subscription | null = null;
  complaintLists: any[] = [];
  complaintListsOrigin?: any[];
  isLoading = false;
  sortState = sortStateSignal({});
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
  itemsPerPage = 5;
  totalItems = 0;
  page = 1;
  constructor(
    protected fb: FormBuilder
  ) { }
  public router = inject(Router);
  protected complaintListService = inject(ComplaintListService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (_index: number, item: IComplaintList): number => this.complaintListService.getComplaintListIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => this.load()),
      )
      .subscribe();
  }
  //convert key when undefine
  checkSearchKey() {
    if (this.product_code == undefined || this.product_code == null) {
      this.product_code = '';
    }
    if (this.product_name == undefined || this.product_name == null) {
      this.product_name = '';
    }
    if (this.report_code == undefined || this.report_code == null) {
      this.report_code = '';
    }
    if (this.branch == undefined || this.branch == null) {
      this.branch = '';
    }
    if (this.reflector == undefined || this.reflector == null) {
      this.reflector = '';
    }
    if (this.department == undefined || this.department == null) {
      this.department = '';
    }
    if (this.checker == undefined || this.checker == null) {
      this.checker = '';
    }
    if (this.create_by == undefined || this.create_by == null) {
      this.create_by = '';
    }
    if (this.status == undefined || this.status == null) {
      this.status = '';
    }
    if (this.unit_of_use == undefined || this.unit_of_use == null) {
      this.unit_of_use = '';
    }
    if (this.implementation_result == undefined || this.implementation_result == null) {
      this.implementation_result = '';
    }
    if (this.complaint == undefined || this.complaint == null) {
      this.complaint = '';
    }
  }
  // tìm kiếm 
  async search() {
    await this.checkSearchKey();
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
  }
  delete(complaintList: IComplaintList): void {
    const modalRef = this.modalService.open(ComplaintListDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.complaintList = complaintList;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.complaintListService.getAll().subscribe(res => {
      this.complaintLists = this.complaintListsOrigin = res.complaintListResponseList.filter((x: any) => x.id != null);
      console.log(res)
    })
    // this.queryBackend().subscribe({
    //   next: (res: EntityArrayResponseType) => {
    //     this.onResponseSuccess(res);
    //   },
    // });
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(this.page, event);
  }

  navigateToPage(page: number): void {
    this.handleNavigation(page, this.sortState());
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
