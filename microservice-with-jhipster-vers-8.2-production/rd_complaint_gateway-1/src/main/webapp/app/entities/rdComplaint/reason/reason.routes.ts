import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ReasonComponent } from './list/reason.component';
import { ReasonDetailComponent } from './detail/reason-detail.component';
import { ReasonUpdateComponent } from './update/reason-update.component';
import ReasonResolve from './route/reason-routing-resolve.service';

const reasonRoute: Routes = [
  {
    path: '',
    component: ReasonComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReasonDetailComponent,
    resolve: {
      reason: ReasonResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReasonUpdateComponent,
    resolve: {
      reason: ReasonResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReasonUpdateComponent,
    resolve: {
      reason: ReasonResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default reasonRoute;
