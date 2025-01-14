import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ComplaintListComponent } from './list/complaint-list.component';
import { ComplaintListDetailComponent } from './detail/complaint-list-detail.component';
import { ComplaintListUpdateComponent } from './update/complaint-list-update.component';
import ComplaintListResolve from './route/complaint-list-routing-resolve.service';

const complaintListRoute: Routes = [
  {
    path: '',
    component: ComplaintListComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ComplaintListDetailComponent,
    resolve: {
      complaintList: ComplaintListResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ComplaintListUpdateComponent,
    resolve: {
      complaintList: ComplaintListResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ComplaintListUpdateComponent,
    resolve: {
      complaintList: ComplaintListResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default complaintListRoute;
