import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ImplementationResultComponent } from './list/implementation-result.component';
import { ImplementationResultDetailComponent } from './detail/implementation-result-detail.component';
import { ImplementationResultUpdateComponent } from './update/implementation-result-update.component';
import ImplementationResultResolve from './route/implementation-result-routing-resolve.service';

const implementationResultRoute: Routes = [
  {
    path: '',
    component: ImplementationResultComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ImplementationResultDetailComponent,
    resolve: {
      implementationResult: ImplementationResultResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ImplementationResultUpdateComponent,
    resolve: {
      implementationResult: ImplementationResultResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ImplementationResultUpdateComponent,
    resolve: {
      implementationResult: ImplementationResultResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default implementationResultRoute;
