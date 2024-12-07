import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ComplaintStatusComponent } from './list/complaint-status.component';
import { ComplaintStatusDetailComponent } from './detail/complaint-status-detail.component';
import { ComplaintStatusUpdateComponent } from './update/complaint-status-update.component';
import ComplaintStatusResolve from './route/complaint-status-routing-resolve.service';

const complaintStatusRoute: Routes = [
  {
    path: '',
    component: ComplaintStatusComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ComplaintStatusDetailComponent,
    resolve: {
      complaintStatus: ComplaintStatusResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ComplaintStatusUpdateComponent,
    resolve: {
      complaintStatus: ComplaintStatusResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ComplaintStatusUpdateComponent,
    resolve: {
      complaintStatus: ComplaintStatusResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default complaintStatusRoute;
