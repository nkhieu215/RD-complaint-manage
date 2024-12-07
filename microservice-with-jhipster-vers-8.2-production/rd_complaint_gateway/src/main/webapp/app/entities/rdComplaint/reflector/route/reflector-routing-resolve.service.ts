import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReflector } from '../reflector.model';
import { ReflectorService } from '../service/reflector.service';

const reflectorResolve = (route: ActivatedRouteSnapshot): Observable<null | IReflector> => {
  const id = route.params['id'];
  if (id) {
    return inject(ReflectorService)
      .find(id)
      .pipe(
        mergeMap((reflector: HttpResponse<IReflector>) => {
          if (reflector.body) {
            return of(reflector.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default reflectorResolve;
