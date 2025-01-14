import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IComplaintStatus } from '../complaint-status.model';
import { ComplaintStatusService } from '../service/complaint-status.service';

const complaintStatusResolve = (route: ActivatedRouteSnapshot): Observable<null | IComplaintStatus> => {
  const id = route.params['id'];
  if (id) {
    return inject(ComplaintStatusService)
      .find(id)
      .pipe(
        mergeMap((complaintStatus: HttpResponse<IComplaintStatus>) => {
          if (complaintStatus.body) {
            return of(complaintStatus.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default complaintStatusResolve;
