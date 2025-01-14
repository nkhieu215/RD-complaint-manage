import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ComplaintComponent } from './list/complaint.component';
import { ComplaintDetailComponent } from './detail/complaint-detail.component';
import { ComplaintUpdateComponent } from './update/complaint-update.component';
import ComplaintResolve from './route/complaint-routing-resolve.service';

const complaintRoute: Routes = [
  {
    path: '',
    component: ComplaintComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ComplaintDetailComponent,
    resolve: {
      complaint: ComplaintResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ComplaintUpdateComponent,
    resolve: {
      complaint: ComplaintResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ComplaintUpdateComponent,
    resolve: {
      complaint: ComplaintResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default complaintRoute;
