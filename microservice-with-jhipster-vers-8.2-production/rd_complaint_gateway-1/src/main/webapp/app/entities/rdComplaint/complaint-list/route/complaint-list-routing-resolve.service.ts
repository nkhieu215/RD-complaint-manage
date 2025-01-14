import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IComplaintList } from '../complaint-list.model';
import { ComplaintListService } from '../service/complaint-list.service';

const complaintListResolve = (route: ActivatedRouteSnapshot): Observable<null | IComplaintList> => {
  const id = route.params['id'];
  if (id) {
    return inject(ComplaintListService)
      .find(id)
      .pipe(
        mergeMap((complaintList: HttpResponse<IComplaintList>) => {
          if (complaintList.body) {
            return of(complaintList.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default complaintListResolve;
