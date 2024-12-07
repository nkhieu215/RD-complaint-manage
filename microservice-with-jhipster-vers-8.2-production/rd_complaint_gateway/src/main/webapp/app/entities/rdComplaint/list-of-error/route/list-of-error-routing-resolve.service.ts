import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IListOfError } from '../list-of-error.model';
import { ListOfErrorService } from '../service/list-of-error.service';

const listOfErrorResolve = (route: ActivatedRouteSnapshot): Observable<null | IListOfError> => {
  const id = route.params['id'];
  if (id) {
    return inject(ListOfErrorService)
      .find(id)
      .pipe(
        mergeMap((listOfError: HttpResponse<IListOfError>) => {
          if (listOfError.body) {
            return of(listOfError.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default listOfErrorResolve;
