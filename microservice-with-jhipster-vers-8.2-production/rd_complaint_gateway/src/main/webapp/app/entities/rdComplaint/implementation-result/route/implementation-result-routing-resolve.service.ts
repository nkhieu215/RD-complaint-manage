import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IImplementationResult } from '../implementation-result.model';
import { ImplementationResultService } from '../service/implementation-result.service';

const implementationResultResolve = (route: ActivatedRouteSnapshot): Observable<null | IImplementationResult> => {
  const id = route.params['id'];
  if (id) {
    return inject(ImplementationResultService)
      .find(id)
      .pipe(
        mergeMap((implementationResult: HttpResponse<IImplementationResult>) => {
          if (implementationResult.body) {
            return of(implementationResult.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default implementationResultResolve;
