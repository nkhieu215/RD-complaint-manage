import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CheckerListComponent } from './list/checker-list.component';
import { CheckerListDetailComponent } from './detail/checker-list-detail.component';
import { CheckerListUpdateComponent } from './update/checker-list-update.component';
import CheckerListResolve from './route/checker-list-routing-resolve.service';

const checkerListRoute: Routes = [
  {
    path: '',
    component: CheckerListComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CheckerListDetailComponent,
    resolve: {
      checkerList: CheckerListResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CheckerListUpdateComponent,
    resolve: {
      checkerList: CheckerListResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CheckerListUpdateComponent,
    resolve: {
      checkerList: CheckerListResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default checkerListRoute;
