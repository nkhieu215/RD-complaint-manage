import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReason } from '../reason.model';
import { ReasonService } from '../service/reason.service';

const reasonResolve = (route: ActivatedRouteSnapshot): Observable<null | IReason> => {
  const id = route.params['id'];
  if (id) {
    return inject(ReasonService)
      .find(id)
      .pipe(
        mergeMap((reason: HttpResponse<IReason>) => {
          if (reason.body) {
            return of(reason.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default reasonResolve;
