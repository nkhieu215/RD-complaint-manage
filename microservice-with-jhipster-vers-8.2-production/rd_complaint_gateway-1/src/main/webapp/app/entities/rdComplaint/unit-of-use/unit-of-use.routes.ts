import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { UnitOfUseComponent } from './list/unit-of-use.component';
import { UnitOfUseDetailComponent } from './detail/unit-of-use-detail.component';
import { UnitOfUseUpdateComponent } from './update/unit-of-use-update.component';
import UnitOfUseResolve from './route/unit-of-use-routing-resolve.service';

const unitOfUseRoute: Routes = [
  {
    path: '',
    component: UnitOfUseComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UnitOfUseDetailComponent,
    resolve: {
      unitOfUse: UnitOfUseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UnitOfUseUpdateComponent,
    resolve: {
      unitOfUse: UnitOfUseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UnitOfUseUpdateComponent,
    resolve: {
      unitOfUse: UnitOfUseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default unitOfUseRoute;
