import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICheckerList } from '../checker-list.model';
import { CheckerListService } from '../service/checker-list.service';

const checkerListResolve = (route: ActivatedRouteSnapshot): Observable<null | ICheckerList> => {
  const id = route.params['id'];
  if (id) {
    return inject(CheckerListService)
      .find(id)
      .pipe(
        mergeMap((checkerList: HttpResponse<ICheckerList>) => {
          if (checkerList.body) {
            return of(checkerList.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default checkerListResolve;
