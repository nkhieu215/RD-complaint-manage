import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUnitOfUse } from '../unit-of-use.model';
import { UnitOfUseService } from '../service/unit-of-use.service';

const unitOfUseResolve = (route: ActivatedRouteSnapshot): Observable<null | IUnitOfUse> => {
  const id = route.params['id'];
  if (id) {
    return inject(UnitOfUseService)
      .find(id)
      .pipe(
        mergeMap((unitOfUse: HttpResponse<IUnitOfUse>) => {
          if (unitOfUse.body) {
            return of(unitOfUse.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default unitOfUseResolve;
