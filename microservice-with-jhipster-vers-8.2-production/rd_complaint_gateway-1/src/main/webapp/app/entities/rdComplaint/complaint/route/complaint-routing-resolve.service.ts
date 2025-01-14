import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IComplaint } from '../complaint.model';
import { ComplaintService } from '../service/complaint.service';

const complaintResolve = (route: ActivatedRouteSnapshot): Observable<null | IComplaint> => {
  const id = route.params['id'];
  if (id) {
    return inject(ComplaintService)
      .find(id)
      .pipe(
        mergeMap((complaint: HttpResponse<IComplaint>) => {
          if (complaint.body) {
            return of(complaint.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default complaintResolve;
